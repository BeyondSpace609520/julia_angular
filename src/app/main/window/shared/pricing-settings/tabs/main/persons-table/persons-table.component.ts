import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { FormatService } from 'easybooking-ui-kit/services/format.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { PersonPricingEntity, Pricing, PricingEntity } from '../../../models';
import { PricesService } from '../../../prices.service';
import { AgeGroup, AgeGroupsService } from '../age-groups/age-groups.service';
import { syncingAgeGroupPrices } from '../utils';

export enum DisplayMode { ROOM_LEVEL = 'room-level', PERCENTAGE = 'percentage' }

@Component({
  selector: 'app-persons-table',
  templateUrl: './persons-table.component.pug',
  styleUrls: ['./persons-table.component.sass'],
})
export class PersonsTableComponent implements OnChanges, OnDestroy {
  @Input() displayMode!: DisplayMode;
  @Input() pricing!: Pricing;
  @Input() fullPayers!: number;
  @Input() stdPricePosition!: number;
  @Input() cateringTypeId!: number;
  @Input() pricingSchemeId!: number;
  // @Input() seasonPeriodEntityId!: number;

  form: FormGroup;
  // form: FormArray;

  get formCaterings() {
    return Object.keys(this.form.controls);
  }

  get currentFormArray(): FormArray {
    return this.form.get(String(this.cateringTypeId)) as FormArray;
  }

  get isRoomLevel() {
    return this.displayMode === DisplayMode.ROOM_LEVEL;
  }

  get isPercentage() {
    return this.displayMode === DisplayMode.PERCENTAGE;
  }

  constructor(
    private pricesService: PricesService,
    public ageService: AgeGroupsService,
    private formatService: FormatService
  ) {
    this.ageService.update
      .pipe(untilDestroyed(this))
      .subscribe((entirely) => {
        if (entirely) {
          this.loadForm();
        }
        this.makePriceFieldDirty(null);
      });
  }

  loadForm(): void {
    this.form = Object.keys(this.pricing.prices).reduce(
      (form, cateringTypeId) => {
        const pricesForCurrentType = this.pricing.prices[cateringTypeId];
        const formArray = new FormArray(
          pricesForCurrentType
            ? pricesForCurrentType.map((c) =>
                this.createPriceControl(
                  c,
                  this.ageService.ageGroups.filter(
                    (age) => age !== null
                  ) as AgeGroup[],
                  this.pricing
                )
              )
            : []
        );

        form.addControl(cateringTypeId, formArray);
        return form;
      },
      new FormGroup({})
    );
  }

  ngOnChanges({ pricing, pricingSchemeId }: SimpleChanges) {
    const pricingChanged =
      pricing && pricing.currentValue !== pricing.previousValue;
    const pricingSchemaChanged =
      pricingSchemeId &&
      pricingSchemeId.currentValue !== pricingSchemeId.previousValue;

    if (pricingChanged || pricingSchemaChanged) {
      this.loadForm();
    }
  }

  private createPriceControl(
    c: PersonPricingEntity,
    ageGroups: Pricing['ageGroups'],
    pricing: Pricing
  ) {
    const group = new FormGroup({
      personsNo: new FormControl(c.personsNo),
      adultPrice: new FormControl(c.adultPrice),
      agesPrice: new FormArray(
        ageGroups.map(
          (ageGroup) =>
            new FormControl(
              ageGroup
                ? this.pricesService.calculateAgesPrice(
                    c,
                    ageGroup.from,
                    ageGroup.to
                  ) || 0
                : 0
            )
        )
      ),
      // if pricing-scheme is 1 - price per belegung - discounts needs to be taken from default adultprice (isStdPricePosition)
      // if pricing-scheme is 2 - price per person - discounts needs to be taken from current adultprice
    });

    if (this.isPercentage) {
      // TODO - could not find a other working way to set dirty flag manually
      (group.get('adultPrice') as FormControl).markAsDirty();

      // isStdPricePosition only changes after save/reload

      (group.get('adultPrice') as FormControl).valueChanges
        .pipe(
          untilDestroyed(this),
          map((v: string) => this.formatService.formattedNumberValue(v))
        )
        .subscribe((price: number) => {
          if (
            (group.get('personsNo') as FormControl).value ===
            this.stdPricePosition
          ) {
            pricing.stdAdultPrice = price;
            this.makePriceFieldDirty(group);
          }
        });

      syncingAgeGroupPrices(
        group,
        this.ageService.ageGroups,
        pipe(
          untilDestroyed(this),
          map((v: string) => this.formatService.formattedNumberValue(v))
        ),
        () => {
          return +this.pricingSchemeId === 1
            ? this.pricing.stdAdultPrice
            : null;
        }
      );
    }

    return group;
  }

  private makePriceFieldDirty(exceptGroup: FormGroup | null) {
    if (this.form && this.form.controls) {
      Object.keys(this.form.controls).forEach((key) => {
        Object.keys((this.form.controls[key] as FormGroup).controls).forEach(
          (subkey) => {
            if (!exceptGroup || 
              exceptGroup.value['personsNo'] !==
              ((this.form.controls[key] as FormGroup).controls[
                subkey
              ] as FormGroup).value['personsNo']
            ) {
              if (
                'adultPrice' in
                ((this.form.controls[key] as FormGroup).controls[
                  subkey
                ] as FormGroup).controls
              ) {
                ((this.form.controls[key] as FormGroup).controls[
                  subkey
                ] as FormGroup).controls['adultPrice'].updateValueAndValidity({
                  onlySelf: false,
                  emitEvent: true,
                });
              }
            }
          }
        );
      });
    }
  }

  private createPriceControlByIndex(
    formArray: FormArray,
    personsNo: number,
    index: number | null = null
  ) {
    const control = this.createPriceControl(
      {
        typeId: null as any,
        seasonPeriodEntityId: null as any,
        isStdPricePosition: false,
        adultPrice: 0,
        percDiscount: 0,
        personsNo,
        ages: [],
      },
      this.ageService.ageGroups.filter((g) => g !== null) as AgeGroup[],
      this.pricing
    );

    if (index !== null) {
      formArray.insert(index, control);
    } else {
      formArray.push(control);
    }
  }

  private removePriceControl(formArray: FormArray, personsNo: number) {
    const index = formArray.controls.findIndex(
      (c) => (c.get('personsNo') as FormControl).value === personsNo
    );

    formArray.removeAt(index);
  }

  public normalizePersonsList(desiredFirstNo: number, desiredLastNo: number) {
    this.formCaterings.forEach((cateringTypeId) => {
      const formArray = this.form.get(cateringTypeId) as FormArray;
      const actualFirstNo: number = (formArray.controls[0].get(
        'personsNo'
      ) as FormControl).value;
      const actualLastNo: number = (formArray.controls[
        formArray.length - 1
      ].get('personsNo') as FormControl).value;

      for (
        let personsNo = actualFirstNo;
        personsNo < desiredFirstNo;
        personsNo++
      ) {
        this.removePriceControl(formArray, personsNo);
      }
      for (
        let personsNo = desiredFirstNo;
        personsNo < actualFirstNo;
        personsNo++
      ) {
        this.createPriceControlByIndex(
          formArray,
          personsNo,
          personsNo - desiredFirstNo
        );
      }
      for (
        let personsNo = Math.max(actualLastNo + 1, desiredFirstNo);
        personsNo <= desiredLastNo;
        personsNo++
      ) {
        this.createPriceControlByIndex(formArray, personsNo);
      }
      for (
        let personsNo = desiredLastNo + 1;
        personsNo <= actualLastNo;
        personsNo++
      ) {
        this.removePriceControl(formArray, personsNo);
      }
    });
  }

  private extractState(
    typeId: number,
    formArray: FormArray
  ): PersonPricingEntity[] {
    return formArray.controls.map(
      (c, i): PersonPricingEntity => ({
        adultPrice: +(c.get('adultPrice') as FormControl).value,
        personsNo: (c.get('personsNo') as FormControl).value,
        isStdPricePosition:
          +(c.get('personsNo') as FormControl).value === this.stdPricePosition, // TODO - done?
        percDiscount: null as any,
        seasonPeriodEntityId: this.pricing.seasonPeriodId, // TODO - check?
        typeId,
        ages: this.ageService.sortedAgeGroups
          .map((age, j) =>
            age
              ? {
                  from: age.from,
                  to: age.to,
                  price: +(c.get('agesPrice') as FormArray).controls[j].value,
                }
              : null
          )
          .filter((age) => age !== null) as PricingEntity['ages'], // TODO
      })
    );
  }

  public extractBody(): Pricing['prices'] {
    return this.formCaterings.reduce(
      (acc, cateringTypeId) => ({
        ...acc,
        [cateringTypeId]: this.extractState(
          +cateringTypeId,
          this.form.get(cateringTypeId) as FormArray
        ),
      }),
      {}
    );
  }

  createNewControlsForEachCatering(row: number, group: AgeGroup): boolean {
    this.formCaterings.forEach((key) => {
      this.createNewControl(row, group, this.form.get(key) as FormArray);
    });

    return true;
  }

  createNewControl(row: number, group: AgeGroup, formArray: FormArray) {
    const groups = formArray.controls[row].get('agesPrice') as FormArray;
    const index = this.ageService.getOriginalIndex(group);

    if (!groups.controls[index]) {
      groups.insert(index, new FormControl(0));
    }
  }

  getAgeGroupControl(priceControl: FormGroup, group: AgeGroup) {
    const index = this.ageService.getOriginalIndex(group);

    return (priceControl.get('agesPrice') as FormArray).controls[index];
  }

  ngOnDestroy() {}
}
