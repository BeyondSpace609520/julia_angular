import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { clampFormControls } from 'easybooking-ui-kit/utils/form';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { merge, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { CompanyDetails } from '@/app/main/models';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { SeasonPeriod } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-type';
import { Pricing, PricingSource } from '../../models';
import { PricesService } from '../../prices.service';
import { AgeGroup, AgeGroupsService } from './age-groups/age-groups.service';
import { CateringsTableComponent } from './caterings-table/caterings-table.component';
import { DisplayMode, PersonsTableComponent } from './persons-table/persons-table.component';

@Component({
  selector: 'app-prices-main-tab',
  templateUrl: './main.component.pug',
  styleUrls: ['./main.component.sass'],
  providers: [AgeGroupsService]
})
export class MainTabComponent implements OnChanges, OnDestroy {

  @Input() source!: PricingSource;
  @Input() period!: SeasonPeriod;
  @Input() hasCaterings!: boolean;
  @Input() canResetGroups!: boolean;
  @Input() saveForAllByDefault!: boolean;
  @Input() extraActionsTemplate!: any;
  @Input() additionalInfoTemplate!: any;
  @Output() saved = new EventEmitter();
  @ViewChild('cateringsTable', { static: false }) cateringsTable: CateringsTableComponent;
  @ViewChild('personsTable', { static: false }) personsTable: PersonsTableComponent;

  pricingSchemes: FormOption[] = [];
  pricingLangSchemes: FormOption[] = [];
  pricing: Pricing;
  form: FormGroup;
  isLoading: Observable<boolean>;

  // avoid losing `this` in an external template
  outletContext = ((self) => ({
    get period() { return self.period; },
    get pricing() { return self.pricing; },
    save: (forAll: boolean) => this.savePricing(forAll)
  }))(this);

  showAgeGroups: boolean;
  hasCateringsScheme: boolean;
  cleanUpChargeActive: boolean;

  // TODO replace getter function with pipe or static variable
  get personsDisplayMode(): DisplayMode {
    const currentId = (this.form.get('pricingSchemeId') as FormControl).value;

    if (this.pricingSchemes.some(s => s.name === 'RoomLevel' && s.value === currentId)) {
      return DisplayMode.ROOM_LEVEL;
    }

    if (this.pricingSchemes.some(s => s.name.startsWith('Perc') && s.value === currentId)) {
      return DisplayMode.PERCENTAGE;
    }

    // fallback to percentage in fixedPrice
    return DisplayMode.PERCENTAGE;
  }

  // TODO replace getter function with pipe or static variable
  get isRoomLevel() {
    return this.personsDisplayMode === DisplayMode.ROOM_LEVEL;
  }

  // TODO replace getter function with pipe or static variable
  get cateringSchemes() {
    if (!this.pricing.caterings) { throw new Error('caterings not found'); }

    const schemes = this.cateringsTable ? this.cateringsTable.activeCaterings : this.pricing.caterings.filter(c => c.active);
    const control = this.form.get('cateringScheme') as FormControl;

    if (!schemes.some(sc => sc.typeId === control.value)) {
      control.setValue(schemes[0].typeId);
    }

    return schemes;
  }

  constructor(
    private mainService: MainService,
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    public pricesService: PricesService,
    public ageService: AgeGroupsService,
    private formData: FormDataService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.PRICING);
    this.mainService.company$.pipe(untilDestroyed(this)).subscribe(companyDetails => {
      this.processCompanyData(companyDetails);
      this.loadPricing();
    });
  }

  loadForm(pricing: Pricing): void {
    const numValidators = [Validators.min(1), Validators.max(90)];
    const { caterings } = pricing;
    // TODO - what to do here? without this form, we cannot create entries
    if (!caterings) { throw new Error('Pricing caterings required'); }
    const stdDisplayCatering = caterings.find(c => c.stdDisplayPrice);
    // TODO - what to do here? without this form, we cannot create entries
    if (!stdDisplayCatering) { throw new Error('Pricing caterings required'); }

    if (!this.pricingLangSchemes.find(scheme => scheme.value === pricing.pricingSchemeId.toString())) {
      pricing.pricingSchemeId = +this.pricingLangSchemes[0].value;
    }

    this.form = new FormGroup({
      pricingSchemeId: new FormControl(pricing.pricingSchemeId.toString()),
      cateringScheme: new FormControl(stdDisplayCatering.typeId),
      finalClean: new FormControl(pricing.cleanUpPrice),
      minPersons: new FormControl(pricing.minPersons, numValidators),
      maxPersons: new FormControl(pricing.maxPersons, numValidators),
      stdPricePosition: new FormControl(pricing.stdPricePosition, numValidators),
      fullPayers: new FormControl(pricing.childDiscountStartPosition, [Validators.min(0), Validators.max(90)]),
      childrenFree: new FormControl(pricing.childUnderXForFree, [Validators.min(0), Validators.max(17)]),
    });

    const minPersons = this.form.get('minPersons') as FormControl;
    const maxPersons = this.form.get('maxPersons') as FormControl;

    clampFormControls(minPersons, this.form.get('stdPricePosition') as FormControl, maxPersons, untilDestroyed(this));

    merge(
      minPersons.valueChanges,
      maxPersons.valueChanges
    ).pipe(untilDestroyed(this), debounceTime(500)).subscribe(() => {
      this.personsTable.normalizePersonsList(+minPersons.value, +maxPersons.value);
    });
  }

  @Loading(LoaderType.PRICING)
  async loadPricing(): Promise<void> {
    this.pricing = await this.apiClient.getPricing(this.source, this.period.id).toPromise();
    [this.pricingSchemes, this.pricingLangSchemes] = await this.formData.getPricingSchemes();

    this.loadForm(this.pricing);
  }

  @Loading(LoaderType.PRICING)
  async resetGroups(): Promise<void> {
    await this.apiClient.resetAgeGroup(this.period.id, this.source).toPromise();
    this.saved.emit();
    await this.loadPricing();
  }

  @Loading(LoaderType.PRICING)
  async savePricing(forAll: boolean): Promise<void> {
    const rawForm = this.form.getRawValue();
    const data: Pricing = {
      pricingSchemeId: +rawForm.pricingSchemeId,
      cleanUpPrice: rawForm.finalClean,
      ageGroups: this.ageService.ageGroups.filter(age => age !== null) as AgeGroup[],
      categoryName: this.pricing.categoryName,
      seasonPeriodId: this.pricing.seasonPeriodId,
      childDiscountStartPosition: rawForm.fullPayers,
      childUnderXForFree: rawForm.childrenFree,
      stdPricePosition: rawForm.stdPricePosition,
      stdAdultPrice: rawForm.stdAdultPrice,
      maxPersons: rawForm.maxPersons,
      minPersons: rawForm.minPersons,
      caterings: this.cateringsTable && this.cateringsTable.extractBody(),
      prices: this.personsTable.extractBody()
    };

    await this.apiClient.savePricing(this.period.id, this.source, forAll, data).toPromise();
    this.saved.emit();
  }

  private processCompanyData(companyDetails: CompanyDetails | null): void {
    this.showAgeGroups = companyDetails ? companyDetails.c_hasAdvancedPricingModule === 'on' : false;
    this.hasCateringsScheme = companyDetails
      ? (companyDetails.c_methodDefaultCatering === 'quota' && companyDetails.c_methodOtherCatering === 'absolute')
      : false;
    this.cleanUpChargeActive = companyDetails ? companyDetails.cleanUpChargeActive : false;
  }

  ngOnChanges({ period, source, pricingSchemeId }: SimpleChanges): void {
    if (
      (period && period.currentValue !== period.previousValue) ||
      (source && source.currentValue !== source.previousValue) ||
      (pricingSchemeId && pricingSchemeId.currentValue !== pricingSchemeId.previousValue)
    ) {
      this.loadPricing();
    }
  }

  ngOnDestroy(): void {}
}
