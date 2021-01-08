import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { ApiRegistrationFormService } from '@/app/helpers/api/api-registration-form.service';
import { CacheService } from '@/app/helpers/cache.service';
import { ServiceState } from '@/app/helpers/models';
import { RegistrationTaxType } from '@/app/main/window/content/customer-admin/create-registration-form/models';
import { HotelRegistrationRecord } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { objectHasAnyOwnProperties } from '@/ui-kit/utils/static.functions';
import { AddCompanyComponent } from './add-company/add-company.component';
import { HotelsUpdatedEvent } from './events';
import { LoaderType } from './loader-types';
import { NumberRanges, ReportingClientProvider } from './models';
import { parseCompanySaveData } from './tabs/company/company-details/parse-company-save-data';
import { GuestTypeValues } from './tabs/guest-types/guest-types.component';

@Injectable({
  providedIn: 'root'
})
export class GuestRegistrationConfigService implements OnDestroy {

  isAdmin: boolean;
  guestTypes: Observable<RegistrationTaxType[] | null>;
  hotels: HotelRegistrationRecord[];
  numberRanges: Observable<NumberRanges | null>;
  providers: ReportingClientProvider[];
  saveEnabled = false;
  selectedHotel: Observable<HotelRegistrationRecord | null>;
  selectedProvider: Observable<ReportingClientProvider | null>;
  state$: Observable<ServiceState>;

  private forms: GuestRegistrationConfigForms = {};
  private guestTypesSource = new BehaviorSubject<RegistrationTaxType[] | null>(null);
  private newCompanyForm = new Subject();
  private numberRangesSource = new BehaviorSubject<NumberRanges | null>(null);
  private state = new BehaviorSubject<ServiceState>(ServiceState.Loading);
  private selectedHotelSource = new BehaviorSubject<HotelRegistrationRecord | null>(null);
  private selectedProviderSource = new BehaviorSubject<ReportingClientProvider | null>(null);

  constructor(
    private apiRegistrationFormService: ApiRegistrationFormService,
    private cacheService: CacheService,
    private eventBusService: EventBusService,
    private loaderService: LoaderService, // needed for @Loading decorator
    private modalService: ModalService,
  ) {
    this.setupObservables();
    this.eventBusService.on<HotelsUpdatedEvent>('hotelsUpdated').pipe(untilDestroyed(this)).subscribe(() => {
      this.loadHotels(true);
    });
    this.preloadData();
    this.selectedHotel.subscribe(() => this.resetForms());
  }

  public addHotel(): void {
    const {modal, modalBody} = this.modalService.openForms(
      'BackEnd_WikiLanguage.MW_NewHotelDialogTitle',
      AddCompanyComponent,
      {
        primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert'
      }
    );
    modalBody.formStateChange.pipe(
      untilDestroyed(this)
    ).subscribe(state => {
      modal.formStatus = state.valid;
    });
    modal.save.pipe(untilDestroyed(this)).subscribe(async () => {
      const newId: number | null = await modalBody.save();
      modal.close(!!newId);
      if (newId) {
        await this.loadHotels(true);
        const selectedHotel = this.getSelectedHotel();
        if (selectedHotel) {
          this.selectHotelById(selectedHotel.id);
        }
      }
    });
  }

  @Loading(LoaderType.CompanyDetailsLoad)
  public async addNumberRange(): Promise<void> {
    const selectedHotel = this.getSelectedHotel();
    if (!selectedHotel) {
      return;
    }
    await this.apiRegistrationFormService.insertNumberRange(selectedHotel.id).toPromise();
    this.loadNumberRanges(selectedHotel.id);
  }

  @Loading(LoaderType.CompanyDetailsLoad)
  public async deleteHotel(): Promise<void> {
    const selectedHotel = this.getSelectedHotel();
    if (!selectedHotel) {
      return;
    }
    await this.apiRegistrationFormService.deleteConfiguration(selectedHotel.id).toPromise();
    await this.loadHotels(true);
    const hotel = this.hotels.length > 0 ? this.hotels[0] : null;
    if (hotel) {
      this.selectHotel(hotel);
    }
  }

  getCompanyForm(): FormGroup | undefined {
    return this.forms.company;
  }

  setCompanyForm(form: FormGroup): void {
    this.forms.company = form;
    this.formSet(form);
    this.processCompanyForm(form);
  }

  getNumberRangesForm(): FormArray | undefined {
    return this.forms.numberRanges;
  }

  setNumberRangesForm(form: FormArray): void {
    this.forms.numberRanges = form;
    this.formSet(form);
  }

  getGuestTypeForm(): GuestTypeValues | undefined {
    return this.forms.guestTypes;
  }

  setGuestTypeForm(form: GuestTypeValues): void {
    this.forms.guestTypes = form;
    this.formSet(form);
  }

  getSelectedHotel(): HotelRegistrationRecord | null {
    return this.selectedHotelSource.getValue();
  }

  getSelectedProvider(): ReportingClientProvider | null {
    return this.selectedProviderSource.getValue();
  }

  @Loading(LoaderType.Load)
  public async itemsSorted(): Promise<void> {
    await this.apiRegistrationFormService.reorderProviders(this.hotels).toPromise();
    this.eventBusService.emit<HotelsUpdatedEvent>('hotelsUpdated');
  }

  @Loading(LoaderType.GuestTypesLoad)
  async loadGuestTypes(hotelId?: HotelRegistrationRecord['id'], forced?: boolean): Promise<void> {
    if (!hotelId) {
      const selectedHotel = this.getSelectedHotel();
      if (!selectedHotel) {
        return;
      }
      hotelId = selectedHotel.id;
    }
    // TODO - clearify: taxtypes != guesttypes
    const guestTypes = await this.cacheService.getRegistrationTaxTypes(hotelId, false, forced);
    this.guestTypesSource.next(guestTypes);
  }

  @Loading(LoaderType.CompanyDetailsLoad)
  async loadHotels(forced?: boolean): Promise<void> {
    this.hotels = [...await this.cacheService.getGuestRegistrationHotels(forced)];

    if (this.hotels && this.hotels.length > 0) {
      this.selectHotel(this.hotels[0]);
    }
  }

  @Loading(LoaderType.FormNumbersLoad)
  async loadNumberRanges(hotelId?: HotelRegistrationRecord['id']): Promise<void> {
    if (!hotelId) {
      const selectedHotel = this.getSelectedHotel();
      if (!selectedHotel) {
        return;
      }
      hotelId = selectedHotel.id;
    }
    const numberRanges = await this.apiRegistrationFormService.getNumberRanges(hotelId).toPromise();
    this.numberRangesSource.next(numberRanges);
  }

  save(): void {
    const selectedHotel = this.getSelectedHotel();
    if (!selectedHotel) {
      return;
    }
    if (this.forms.company && this.forms.company.dirty) {
      this.saveHotel(selectedHotel.id, this.forms.company);
    }
    if (this.forms.numberRanges && this.forms.numberRanges.dirty) {
      this.saveNumberRanges(selectedHotel.id, this.forms.numberRanges);
    }
    if (this.forms.guestTypes && this.forms.guestTypes.dirty) {
      this.saveGuestTypes(selectedHotel.id, this.forms.guestTypes);
    }
  }

  selectHotel(hotel: HotelRegistrationRecord | null): void {
    this.forms = {};
    this.selectedHotelSource.next(hotel);
    const provider = hotel && this.providers && this.providers.find(p => p.id === hotel.guestRegistrationProviderId);
    this.selectProvider(provider || null);
  }

  private formSet(form: FormGroup | FormArray | GuestTypeValues): void {
    (form.hasOwnProperty('selectedIds')
      ? (form as GuestTypeValues).changed
      : (form as AbstractControl).valueChanges
    ).pipe(untilDestroyed(this)).subscribe(() => {
      this.checkIfSaveIsEnabled();
    });

    this.checkIfSaveIsEnabled();
  }

  private checkIfSaveIsEnabled(): void {
    if (!objectHasAnyOwnProperties(this.forms)) {
      this.saveEnabled = false;
      return;
    }
    const allValid = Object.keys(this.forms).every(formKey => this.extractValue(formKey, 'valid'));
    const someDirty = Object.keys(this.forms).some(formKey => this.extractValue(formKey, 'dirty', false));
    this.saveEnabled = allValid && someDirty;
  }

  private extractValue(formKey, fieldName, fallback = true): boolean {
    if (!this.forms.hasOwnProperty(formKey)) {
      return fallback;
    }
    const result = this.forms[formKey][fieldName];
    if (result !== true && result !== false) {
      return fallback;
    }
    return result;
  }

  private async preloadData(): Promise<void> {
    const [providers, companyDetails] = await Promise.all([
      this.cacheService.getReportingClientProviders(),
      this.cacheService.getCompanyDetails(),
    ]);
    this.providers = providers;
    this.isAdmin = companyDetails.au_isAdmin === 'on';
    this.state.next(ServiceState.Ready);
  }

  private processCompanyForm(form: FormGroup): void {
    this.newCompanyForm.next();
    const providerField = form.get('guestRegistrationProviderId');
    if (providerField) {
      providerField.valueChanges.pipe(
        untilDestroyed(this),
        takeUntil(this.newCompanyForm),
        distinctUntilChanged()
      ).subscribe(selectedProviderId => {
        const selectedProvider = this.providers.find(p => p.id === +selectedProviderId);
        this.selectProvider(selectedProvider || null);
      });
    }
  }

  private resetForms(): void {
    this.forms = {};
  }

  @Loading(LoaderType.Load)
  private async saveGuestTypes(hotelId: HotelRegistrationRecord['id'], guestTypesForm: GuestTypeValues) {
    await this.apiRegistrationFormService.saveMyGuestTypes(hotelId, guestTypesForm.selectedIds).toPromise();
    this.loadGuestTypes(hotelId, true);
  }

  @Loading(LoaderType.Load)
  private async saveHotel(hotelId: HotelRegistrationRecord['id'], companyForm: FormGroup): Promise<void> {
    await this.apiRegistrationFormService.setGeneralSettings(
      parseCompanySaveData(companyForm.getRawValue(), hotelId)
    ).toPromise();
    this.loadHotels(true);
  }

  @Loading(LoaderType.Load)
  private async saveNumberRanges(hotelId: HotelRegistrationRecord['id'], numberRangesForm: FormArray): Promise<void> {
    await this.apiRegistrationFormService.updateNumberRanges(
      hotelId,
      numberRangesForm.getRawValue(),
    ).toPromise();
    this.loadNumberRanges(hotelId);
  }

  private selectHotelById(hotelId: HotelRegistrationRecord['id']): void {
    const hotelToSelect = this.hotels.find(hotel => hotel.id === hotelId);
    if (hotelToSelect) {
      this.selectHotel(hotelToSelect);
    }
  }

  private selectProvider(provider: ReportingClientProvider | null): void {
    this.selectedProviderSource.next(provider);
  }

  private setupObservables(): void {
    this.state$ = this.state.asObservable();
    this.selectedHotel = this.subscriptionFromSubject(this.selectedHotelSource);
    this.selectedProvider = this.subscriptionFromSubject(this.selectedProviderSource);
    this.numberRanges = this.subscriptionFromSubject(this.numberRangesSource);
    this.guestTypes = this.subscriptionFromSubject(this.guestTypesSource);
  }

  private subscriptionFromSubject<T>(subject: BehaviorSubject<T>): Observable<T> {
    return subject
      .asObservable()
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged()
      );
  }

  ngOnDestroy(): void {}
}

interface GuestRegistrationConfigForms {
  company?: FormGroup;
  numberRanges?: FormArray;
  guestTypes?: GuestTypeValues;
}

