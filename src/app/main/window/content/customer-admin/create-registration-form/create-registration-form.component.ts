import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { FormErrorService } from '@/app/main/window/shared/services/form-error.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Window } from '../../../models';
import { EventBusService } from '../../../shared/event-bus';
import { normalizeDateRange } from '../../../shared/forms/utils';
import { WindowsService } from '../../../windows.service';
import { GuestDetail, GuestType } from '../guest-information/models';
import { RefreshRegistrationForms } from '../guest-registration/events';
import {
  GuestRegistrationForm,
  GuestRegistrationItem,
  HotelRegistrationRecord,
  RegistrationType,
  TravelPurpose
} from '../guest-registration/models';
import { Providers } from './consts';
import { CreateRegistrationFormService } from './create-registration-form.service';
import { LoaderType } from './loader-types';
import {
  GuestsCategory, IndividualGuestsData,
  RegFormBody,
  RegistrationFormGroup,
  RegistrationFormGuests,
  RegistrationGuestTypes,
} from './models';
import { validateRegFormLocally } from './validation';

@Component({
  selector: 'app-create-registration-form',
  templateUrl: './create-registration-form.component.pug',
  styleUrls: ['./create-registration-form.component.sass']
})
export class CreateRegistrationFormComponent implements OnInit, OnDestroy {

  @Input() hotel!: HotelRegistrationRecord;
  @Input() bookingId!: GuestRegistrationItem['bookingId'];
  @Input() registrationFormId?: GuestRegistrationForm['id'];
  @Input() window: Window;

  public form: FormGroup;
  public types: RegistrationType[];
  public guests: RegistrationFormGuests;
  public isLoading: Observable<boolean>;
  public hotelRecords: HotelRegistrationRecord[] = [];

  public GuestsCategory = GuestsCategory;
  public Providers = Providers;

  private allGuestTypes: RegistrationGuestTypes;

  // TODO replace getter function with pipe or static variable
  get selectedType() {
    return this.types && this.form ? this.types.find(t => t.value === (this.form.get('type') as FormControl).value) : null;
  }

  // TODO replace getter function with pipe or static variable
  get registrationForm(): GuestRegistrationForm | undefined {
    return this.registrationFormService.registrationForm;
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modal: ModalService,
    private translate: TranslateService,
    private registrationFormService: CreateRegistrationFormService,
    private eventBus: EventBusService,
    private windows: WindowsService,
    private formErrorService: FormErrorService,
    private cacheService: CacheService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  public isTypeAvailable(regType: RegistrationType): boolean {
    switch (regType.category) {
      case GuestsCategory.INDIVIDUAL: return true;
      case GuestsCategory.GROUP: return this.hotel.allowTravelGroup && this.registrationFormService.linkedGuestsCount >= 7;
      case GuestsCategory.DETAIL_GROUP: return this.registrationFormService.linkedGuestsCount >= 7;
      default: return false;
    }
  }

  public getPreselectedType(): RegistrationType | undefined {
    let category = GuestsCategory.GROUP;

    if (this.registrationForm && this.registrationForm.detailGroupRequired) {
      category = GuestsCategory.DETAIL_GROUP;
    } else if (this.guests.individual && this.guests.individual.length > 6 && this.hotel.allowTravelGroup) {
      category = GuestsCategory.GROUP;
    } else if (this.guests.individual && this.guests.individual.length <= 6) {
      category = GuestsCategory.INDIVIDUAL;
    } else if (!this.hotel.allowTravelGroup) {
      category = GuestsCategory.DETAIL_GROUP;
    }

    return this.types.find(t => t.category === category);
  }

  public loadForm(data: {
    arrived: boolean,
    departed: boolean,
    fromDate: Date,
    untilDate: Date,
    type?: number,
    actualDeparture: Date | null,
    travelPurpose: TravelPurpose | null,
  }): void {
    if (this.hotel.guestRegistrationProviderId === Providers.WILKEN && !data.travelPurpose) {
      data.travelPurpose = 'holiday';
    }

    const arrivedControl = new FormControl({ value: data.arrived, disabled: data.arrived });
    const departedControl = new FormControl({ value: data.departed, disabled: data.departed });
    const arrivalControl = new FormControl(data.fromDate);
    const plannedDepartureControl = new FormControl({ value: data.untilDate, disabled: data.departed });
    const actualDepartureControl = new FormControl({ value: data.actualDeparture, disabled: data.departed });
    const travelPurposeControl = new FormControl(data.travelPurpose);

    this.form = new FormGroup({
      type: new FormControl(data.type),
      actualDeparture: actualDepartureControl,
      arrival: arrivalControl,
      plannedDeparture: plannedDepartureControl,
      arrived: arrivedControl,
      departed: departedControl,
      travelPurpose: travelPurposeControl,
    });

    normalizeDateRange(arrivalControl, plannedDepartureControl, untilDestroyed(this));
    normalizeDateRange(arrivalControl, actualDepartureControl, untilDestroyed(this));
    arrivedControl.valueChanges.pipe(startWith(arrivedControl.value)).subscribe(active => {
      if (data.departed) { return; }
      if (active) {
        departedControl.enable();
      } else {
        departedControl.disable();
        departedControl.setValue(false);
      }
    });
  }

  public deleteGuest(guest: GuestDetail): void {
    const index = this.guests.individual.indexOf(guest);
    if (index < 0) {
      return;
    }
    this.guests.individual = this.guests.individual.filter(g => g.id !== guest.id);
  }

  @Loading(LoaderType.LOAD)
  public async saveTravelGroup({leader, guests}: RegistrationFormGroup): Promise<void> {
    const form = this.createSavingForm();

    const confirmed = await this.checkSaveConfirmations(form);
    if (!confirmed) {
      console.warn('Interrupted saving process');
      return;
    }

    try {
      await this.apiClient.saveRegistrationForm(form, undefined, guests, leader).toPromise();
    } catch (error) {
      await this.formErrorService.showDepartedError(
        error.code,
        error.text,
        this.registrationFormId || null,
        this.registrationForm && this.registrationForm.canForceDeparture || false,
      );
    } finally {
      this.eventBus.emit<RefreshRegistrationForms>('refreshRegistrationForms', null);
      this.windows.closeWindow(this.window);
    }
  }

  @Loading(LoaderType.LOAD)
  public async save({ main, all }: IndividualGuestsData): Promise<void> {
    const form = this.createSavingForm();

    // TODO - do we need forced parameter here - like everywhere else?
    const taxTypes = await this.cacheService.getRegistrationTaxTypes(
      form.hotelRecordId, true, false
    );

    const msg = await validateRegFormLocally(form, all, taxTypes, t => this.translate.get(t).toPromise());
    if (msg) {
      this.modal.openSimpleText('', msg);
      return;
    }

    const valid = await this.validateRegFormRemotely(form, { main, all });
    if (!valid) {
      console.error('Failed remote validation');
      return;
    }

    const confirmed = await this.checkSaveConfirmations(form);
    if (!confirmed) {
      console.warn('Interrupted saving process');
      return;
    }

    try {
      await this.apiClient.saveRegistrationForm(form, all).toPromise();
    } catch (error) {
      await this.formErrorService.showDepartedError(
        error.code,
        error.text,
        this.registrationFormId || null,
        this.registrationForm && this.registrationForm.canForceDeparture || false,
      );
    } finally {
      this.eventBus.emit<RefreshRegistrationForms>('refreshRegistrationForms', null);
      this.windows.closeWindow(this.window);
    }
  }

  private createDefaultGroup(guests: GuestDetail[]): RegistrationFormGroup {
    guests = [...guests];
    const leader: GuestDetail | undefined = (guests && guests.length > 0) ? guests.shift() : undefined;
    return {
      leader: leader || null,
      guests: guests ? guests.map(guest => {
        return {
          id: guest.id,
          count: 1,
          countryId: guest.countryId,
          taxTypeId: guest.taxTypeId,
          registrationFormId: this.registrationFormId || null,
          registrationFormCountryExternalId: null,
        };
      }) : []
    };
  }

  private createSavingForm(): RegFormBody {
    const { type, actualDeparture, arrival, plannedDeparture, arrived, departed, travelPurpose } = this.form.getRawValue();
    const form: RegFormBody = {
      arrived,
      bookingId: this.bookingId,
      departed,
      fromDate: arrival,
      hotelRecordId: this.hotel.id,
      id: this.registrationForm ? this.registrationForm.id : -1,
      number: this.registrationForm ? this.registrationForm.number : -1,
      plannedUntilDate: plannedDeparture,
      untilDate: actualDeparture,
      registrationTypeId: type,
      travelPurpose
    };
    return form;
  }

  private detectGuestTypes(preselectedType: RegistrationType | undefined): void {
    if (!this.guests || !this.guests.individual || !preselectedType) {
      return;
    }
    this.guests.individual.map((guestData, index) => {
      if (index === 0) {
        guestData.guestTypeId = this.getMainGuestTypeId(preselectedType);
      } else {
        guestData.guestTypeId = this.getOtherGuestTypeId(guestData, preselectedType);
      }
    });
  }

  private getMainGuestTypeId(preselectedType: RegistrationType): number {
    if (preselectedType.category === GuestsCategory.INDIVIDUAL) {
      return this.allGuestTypes.main.value;
    } else {
      return this.allGuestTypes.tourGuide.value;
    }
  }

  private getOtherGuestTypeId(guest: GuestDetail, preselectedType: RegistrationType): number {
    if (preselectedType.category !== GuestsCategory.INDIVIDUAL) {
      return this.allGuestTypes.groupGuest.value;
    } else if (guest.type === GuestType.CHILD) {
      return this.allGuestTypes.child.value;
    } else {
      return this.allGuestTypes.adult.value;
    }
  }

  private async validateRegFormRemotely(body: RegFormBody, { main, all }: IndividualGuestsData): Promise<boolean> {
    if (body.arrived || body.departed) {
      const invalidGuest = await this.apiClient.validateGuests(body.hotelRecordId, all, main).toPromise();

      if (invalidGuest) {
        this.registrationFormService.editGuestInformation(invalidGuest, body.arrived, main && main.guestId);
        this.modal.openSimpleText('', 'BackEnd_WikiLanguage.MW_guestDataNotComplete_error');
        return false;
      }
    }
    return true;
  }

  private async checkSaveConfirmations(body: RegFormBody): Promise<boolean> {
    const allowDeparted = !body.departed
      || await this.modal.openConfirm('BackEnd_WikiLanguage.MW_AreYouSure', 'BackEnd_WikiLanguage.MW_DepartedWarning');
    const allowArrived = !(body.arrived && !body.departed && (!this.registrationForm || ['-1', '0'].includes(this.registrationForm.number)))
      || await this.modal.openConfirm('BackEnd_WikiLanguage.MW_AreYouSure', 'BackEnd_WikiLanguage.MW_ArrivedWarning');

    return allowDeparted && allowArrived;
  }


  @Loading(LoaderType.LOAD)
  async ngOnInit(): Promise<void> {
    // console.log('reading hotels');
    this.hotelRecords = await this.cacheService.getGuestRegistrationHotels();
    // console.log('ready hotels', this.hotelRecords);

    // TODO - at this point, this.hotel is not based on loaded registrationFormId but on dropdown value
    const [
      data,
      types,
      individualData,
      { fromDate, untilDate },
      allGuestTypes
    ] = await this.registrationFormService.initialize(this.registrationFormId, this.hotel, this.bookingId);

    // DONE - if registrationForm.guestRegistrationProviderId is set (!=null)
    // then the form has been tracked to an provider already
    // and should not use the provider from @Input but the id saved in the form
    // console.log('registrationForm', this.registrationForm);
    if (
      this.registrationForm &&
      this.registrationForm.guestRegistrationSettingsId
    ) {
      const settingsId = this.registrationForm.guestRegistrationSettingsId;
      // console.log('search for setting', settingsId);
      this.hotel =
        (settingsId && this.hotelRecords.find((r) => r.id === +settingsId)) ||
        this.hotel;
      // console.log('found hotel', this.hotel);
    }

    this.types = types;

    if (data) {
      this.guests = data;
      if (data.form && data.individual && data.form.registrationTypeId === 1) {
        this.guests.group = this.createDefaultGroup(data.individual);
      }
    } else {
      this.guests = {
        individual: individualData,
        group: this.createDefaultGroup(individualData)
      };
    }

    this.allGuestTypes = allGuestTypes;

    const preselectedType = this.getPreselectedType();

    if (!this.registrationFormId) {
      this.detectGuestTypes(preselectedType);
    }

    this.loadForm({
      arrived: this.registrationForm ? this.registrationForm.arrived : false,
      departed: this.registrationForm ? this.registrationForm.departed : false,
      fromDate: this.registrationForm && this.registrationForm.fromDate || fromDate,
      untilDate: this.registrationForm && this.registrationForm.plannedUntilDate || untilDate,
      type: this.registrationForm && this.registrationForm.registrationTypeId || preselectedType && preselectedType.value,
      actualDeparture: this.registrationForm ? this.registrationForm.untilDate : null,
      travelPurpose: this.registrationForm ? this.registrationForm.travelPurpose : null
    });
  }

  ngOnDestroy(): void {}
}
