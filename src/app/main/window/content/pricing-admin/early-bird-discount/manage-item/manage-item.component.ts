import { Component, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { DiscountDetailsComponent } from '@/app/main/window/shared/discount/details/details.component';
import { Discount } from '@/app/main/window/shared/discount/models';
import { conditionalRequired, normalizeDateRange, subscribeToFormStateChange } from '@/app/main/window/shared/forms/utils';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { DiscountDateType, EarlyBirdDiscountDetail } from '../models';

@Component({
  selector: 'app-manage-item',
  templateUrl: './manage-item.component.pug',
  styleUrls: ['./manage-item.component.sass']
})
export class ManageItemComponent implements OnChanges, OnDestroy {
  private formState = new BehaviorSubject<FormState>({
    valid: true,
    dirty: false,
    touched: false
  });

  @Input() item!: Discount;
  @Input() extraFields = true;
  @Output() formStateChange = this.formState.asObservable().pipe(
    untilDestroyed(this),
    map(state => {
      state.valid = getAllValid(this.form, this.fieldValidations);
      return state;
    }),
    distinctUntilChanged((previous: FormState, current: FormState) => {
      return (
        previous.valid === current.valid
        && previous.dirty === current.dirty
        && previous.touched === current.touched
      );
    })
  );
  @ViewChild('discountDetails', { static: false }) manage!: DiscountDetailsComponent;

  public details: EarlyBirdDiscountDetail | null;
  public form: FormGroup;

  public DiscountDateType = DiscountDateType;

  private fieldValidations = {
    discountDetails: true,
    fromAndUntilDate: true,
    fixedDate: true
  };

  constructor(
    public loaderService: LoaderService,
    private apiClient: ApiClient,
    private mainService: MainService
  ) { }

  public selectTranslation(localeId: number): void {
    if (!this.item) { return; }

    this.load(this.item, localeId);
  }

  @Loading(LoaderType.MANAGE)
  public async load(item: Discount | null, localeId: number): Promise<void> {
    const details = this.details = item ? await this.apiClient.getEarlyBirdDiscountDetail(item.id, +localeId).toPromise() : null;

    const dateType = new FormControl(details ? details.dateType : DiscountDateType.DAYS);
    const isFixedDate = dateType.valueChanges.pipe(untilDestroyed(this), map(val => val === DiscountDateType.FIXED));

    this.form = new FormGroup({
      fromDate: new FormControl(details ? details.fromDate : new Date()),
      untilDate: new FormControl(details ? details.untilDate : new Date()),
      daysBeforeArrival: new FormControl(details ? details.daysBeforeArrival : 0),
      fixedDate: new FormControl(details ? details.fixedDate : new Date(), [conditionalRequired(isFixedDate)]),
      dateType
    });
    (window as any).form = this.form;

    normalizeDateRange(this.form.get('fromDate') as FormControl, this.form.get('untilDate') as FormControl, untilDestroyed(this));

    subscribeToFormStateChange(this, this.form, this.formState);
  }

  public extractForm(): EarlyBirdDiscountDetail {
    return {
      id: this.item ? this.item.id : null,
      ...(this.manage ? this.manage.extractForm() : {}),
      ...this.form.getRawValue()
    };
  }

  public onFieldStatusChange(fieldId: string, status: string | boolean): void {
    this.fieldValidations[fieldId] = status === true || status === 'VALID';
    const valid: boolean = getAllValid(this.form, this.fieldValidations);
    const {touched, dirty} = this.formState.getValue();
    this.formState.next({
      valid,
      touched,
      dirty
    });
  }

  ngOnChanges({ item }: SimpleChanges): void {
    if (item && item.previousValue !== item.currentValue) {
      this.load(item.currentValue, +this.mainService.getCompanyDetails().c_beLocale_id);
    }
  }

  ngOnDestroy() {}
}

function getAllValid(form: FormGroup, fieldValidations: {[k: string]: boolean}): boolean {
  return [
    form && form.valid,
    fieldValidations.discountDetails,
    fieldValidations.fixedDate,
    fieldValidations.fromAndUntilDate
  ].every(v => v);
}
