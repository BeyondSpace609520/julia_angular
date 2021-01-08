import { Component, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { subscribeToFormStateChange } from '@/app/main/window/shared/forms/utils';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { LastMinutesItem, LastMinutesItemBody } from '../models';

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

  @Input() item!: LastMinutesItem;
  @Input() compact = false;
  @Output() formStateChange = this.formState.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged((previous: FormState, current: FormState) => {
      return (
        previous.valid === current.valid
        && previous.dirty === current.dirty
        && previous.touched === current.touched
      );
    })
  );

  designations: FormOption[] = [
    {
      name: 'BackEnd_WikiLanguage.LM_period',
      value: 'bookingPeriod'
    },
    {
      name: 'BackEnd_WikiLanguage.LM_bookingDate',
      value: 'bookingCreation'
    }
  ];
  daySamples: FormOption<boolean>[] = [
    {
      name: 'BackEnd_WikiLanguage.LM_Days_new',
      value: false
    },
    {
      name: 'BackEnd_WikiLanguage.LM_days_limited',
      value: true
    }
  ];
  locales: FormOption[] = [];
  form: FormGroup;
  isLoading: Observable<boolean>;

  constructor(
    private formDataService: FormDataService,
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private translate: TranslateService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MANAGE_ITEM);
    this.locales = this.formDataService.getLocals();
  }

  init(item: LastMinutesItem): void {
    if (!item) {
      return;
    }

    this.item = item;

    this.form = new FormGroup({
      periodType: new FormControl(item.periodType ? item.periodType : 'bookingPeriod'),
      limitedDiscount: new FormControl(item.limitedDiscount ? item.limitedDiscount : false),
      value: new FormControl(item.value ? item.value : this.translate.instant('BackEnd_WikiLanguage.lastMinuteTitle')),
      fromDate: new FormControl(item.fromDate ? item.fromDate : null),
      untilDate: new FormControl(item.fromDate ? item.untilDate : null),
      nights: new FormControl(item.nights ? item.nights : 0),
      percDiscount: new FormControl(item.percDiscount ? item.percDiscount : 0),
      localeId: new FormControl(this.locales[0].value)
    });
    (this.form.get('localeId') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(async localeId => {
      (this.form.get('value') as FormControl).setValue(await this.loadTranslation(localeId));
    });

    subscribeToFormStateChange(this, this.form, this.formState);
  }

  @Loading(LoaderType.MANAGE_ITEM)
  private async loadTranslation(localeId: number): Promise<void> {
    return await this.apiClient.getLastMinutesTranslation(this.item.id, localeId).toPromise();
  }

  @Loading(LoaderType.MANAGE_ITEM)
  public async save(): Promise<void> {
    const body: LastMinutesItemBody = {
      id: this.item ? this.item.id : undefined,
      ...this.form.getRawValue()
    };

    await this.apiClient.saveLastMinutesItem(body).toPromise();
  }

  ngOnChanges({ item }: SimpleChanges): void {
    if (item && item.currentValue !== item.previousValue) {
      this.init(item.currentValue);
    }
  }

  ngOnDestroy(): void {}
}
