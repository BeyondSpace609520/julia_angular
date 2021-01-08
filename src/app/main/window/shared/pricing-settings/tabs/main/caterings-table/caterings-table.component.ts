import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { FormatService } from 'easybooking-ui-kit/services/format.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { MainService } from '@/app/main/main.service';
import { Pricing, PricingEntity } from '../../../models';
import { PricesService } from '../../../prices.service';
import { AgeGroup, AgeGroupsService } from '../age-groups/age-groups.service';
import { syncingAgeGroupPrices } from '../utils';

@Component({
  selector: 'app-caterings-table',
  templateUrl: './caterings-table.component.pug',
  styleUrls: ['./caterings-table.component.sass']
})
export class CateringsTableComponent implements OnChanges, OnDestroy {

  @Input() pricing!: Pricing;

  displayPrice: FormControl;
  caterings: FormArray;

  get activeCaterings() {
    const { caterings = [] } = this.pricing;

    return caterings.filter((_, i) => (this.caterings.controls[i].get('active') as FormControl).value);
  }

  get percentageOutOfRoomPrice() {
    return this.companyDetails.c_methodDefaultCatering === 'quota' && this.companyDetails.c_methodOtherCatering === 'relative';
  }

  get visibleAges() {
    return !(this.companyDetails.c_methodDefaultCatering === 'quota' && this.companyDetails.c_methodOtherCatering === 'absolute');
  }

  get companyDetails() {
    return this.mainService.getCompanyDetails();
  }

  constructor(
    public pricesService: PricesService,
    private formatService: FormatService,
    private ageService: AgeGroupsService,
    private mainService: MainService
  ) {
    this.ageService.update.pipe(untilDestroyed(this)).subscribe((entirely) => entirely && this.loadForm());
  }

  async loadForm() {
    const caterings = this.pricing.caterings || [];

    this.displayPrice = new FormControl(caterings.findIndex(c => c.stdDisplayPrice)),
    this.caterings = new FormArray(caterings.map(c => {
      const group = new FormGroup({
        active: new FormControl(c.active),
        adultPrice: new FormControl(c.adultPrice),
        agesPrice: new FormArray(this.ageService.ageGroups.map(ageGroup =>
          new FormControl(ageGroup ? this.pricesService.calculateAgesPrice(c, ageGroup.from, ageGroup.to) : 0)
        ))
      });
      syncingAgeGroupPrices(group, this.ageService.ageGroups, pipe(
        untilDestroyed(this),
        map((v: string) => this.formatService.formattedNumberValue(v))
      ));
        // {} as Pricing);

      return group;
    }));

    // unchangeable active checkbox depending on display price
    const cateringsActive = this.caterings.controls.map(group => group.get('active') as FormControl);

    cateringsActive.map((control, index) => control.valueChanges.pipe(untilDestroyed(this)).subscribe(newValue => {
      if (newValue === false && this.displayPrice.value === index) {
        control.setValue(true);
      }
    }));
  }

  async ngOnChanges({ pricing }: SimpleChanges) {
    if (pricing && pricing.currentValue !== pricing.previousValue) {
      await this.loadForm();
    }
  }

  createNewControl(row: number, group: AgeGroup): boolean {
    const groups = this.caterings.controls[row].get('agesPrice') as FormArray;
    const index = this.ageService.getOriginalIndex(group);

    if (!groups.controls[index]) {
      groups.insert(index, new FormControl(0));
    }

    return true;
  }

  getGroupForm(row: number, group: AgeGroup): FormControl {
    const index = this.ageService.getOriginalIndex(group);

    return (this.caterings.controls[row].get('agesPrice') as FormArray).controls[index] as FormControl;
  }

  public extractBody(): Pricing['caterings'] {
    return this.caterings.controls.map((c, i) => {
      const ages = this.ageService.ageGroups.map((age, j) => (age ? {
        from: age.from,
        to: age.to,
        price: +(c.get('agesPrice') as FormArray).controls[j].value
      } : null)).filter(age => age !== null) as PricingEntity['ages'];

      return {
        entityGroupId: null as any, // TODO
        seasonPeriodEntityId: null as any,
        adultPrice: +(c.get('adultPrice') as FormControl).value,
        typeId: this.pricing.caterings ? this.pricing.caterings[i].typeId : null as any,
        active: (c.get('active') as FormControl).value,
        stdDisplayPrice: +this.displayPrice.value === i,
        ages
      };
    });
  }

  ngOnDestroy() {}
}
