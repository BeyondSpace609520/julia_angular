import { Component, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { Discount } from '@/app/main/window/shared/discount/models';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';

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

  form: FormGroup;
  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.ITEM);
  }

  onDatepickerStatusChange(status: string): void {
    const {touched, dirty} = this.formState.getValue();
    this.formState.next({
      valid: status === 'VALID',
      touched,
      dirty
    });
  }

  @Loading(LoaderType.ITEM)
  async loadForm(item?: Discount, defaults?: { time: number | null }) {
    this.form = new FormGroup({
      fromDate: new FormControl(item ? item.fromDate : this.getDefaultDate(defaults ? defaults.time : null, 0), [Validators.required]),
      untilDate: new FormControl(item ? item.untilDate : this.getDefaultDate(defaults ? defaults.time : null, 1), [Validators.required])
    });
  }

  private getDefaultDate(time: number | null, offset: number): Date {
    const date = time ? new Date(time) : new Date();

    date.setDate(date.getDate() + offset);

    return date;
  }

  @Loading(LoaderType.ITEM)
  async save(): Promise<void> {
    const item: Discount = {
      id: this.item ? this.item.id : 0,
      ...this.form.getRawValue()
    };

    await this.apiClient.saveLongStayDiscount(item).toPromise();
  }

  ngOnChanges({ item }: SimpleChanges): void {
    if (item && item.currentValue !== item.previousValue) {
      this.loadForm(item.currentValue);
    }
  }

  ngOnDestroy(): void {}
}
