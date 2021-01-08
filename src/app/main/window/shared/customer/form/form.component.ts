import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { flatten } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { ViewService } from '@/app/main/view/view.service';
import { focusRoomplan } from '@/app/main/window/content/calendar/calendar-html/focusRoomplan';
import {
  getGuestValidationFields,
  ValidationLevel
} from '@/app/main/window/content/customer-admin/guest-information/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { MoveToRoomplanEvent } from '../../../content/calendar/calendar-html/events';
import { Guest } from '../../../content/customer-admin/customer-more-information/models';
import { GuestDetail } from '../../../content/customer-admin/guest-information/models';
import { EventBusService } from '../../event-bus';
import { chooseCustomerModal } from '../choose/modal';
import { Customer } from '../models';
import { FieldKeys, Fields, getColumnsFields, Resources, setFieldsValidators } from './fields';

enum LoaderType {
  LOAD = 'load-customer-form'
}

@Component({
  selector: 'app-customer-form',
  templateUrl: './form.component.pug',
  styleUrls: ['./form.component.sass']
})
export class CustomerFormComponent<T extends Guest> implements OnChanges, OnDestroy {

  @Input() guest!: T;
  @Input() validationLevel?: ValidationLevel;
  @Output() modifyColumns = new EventEmitter<Fields<T>[]>();

  form: FormGroup;
  resources: {[key in Resources]: FormOption<string | number | null>[]};
  isLoading: Observable<boolean>;

  private columns: Fields<T>[];
  private get fields(): Fields<T> {
    return flatten(this.columns);
  }
  private newForm = new Subject();

  @ViewChild('birthDateTooltip', { static: true }) private birthDateTooltip: any;

  constructor(
    private apiClient: ApiClient,
    private formData: FormDataService,
    private eventBus: EventBusService,
    private modalService: ModalService,
    private loaderService: LoaderService,
    private cacheService: CacheService,
    private viewService: ViewService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  extract(): T {
    return {
      ...this.guest,
      ...(this.form.get('fields') as FormGroup).getRawValue() as T
    };
  }

  async openChooseGuestModal(): Promise<void> {
    const searchValue = ((this.form.get('fields') as FormControl).get(
      'lastName'
    ) as FormControl).value;
    const customer = await chooseCustomerModal(
      this.modalService,
      searchValue,
      this.guest.id
    );
    if (!customer) { return; }

    this.fields.forEach(([_, __, prop]) => {
      if (prop in customer) {
        ((this.form.get('fields') as FormControl).get(String(prop)) as FormControl).setValue(customer[prop as keyof Customer]);
      }
    });
  }

  async openRoomplan(): Promise<void> {
    await focusRoomplan(this.viewService);

    this.eventBus.emit<MoveToRoomplanEvent>('moveToRoomplan', {
      arrivalDate: this.guest.minArrivalDate,
      id: this.guest.linkedBooking,
      type: this.guest.bsName
    });
  }

  @Loading(LoaderType.LOAD)
  private async loadResources(localeId: string): Promise<void> {
    const salutations = this.formData.getSalutations(new FormControl(localeId));
    const countries = this.formData.getCountries();
    const data = await this.formData.getCustomerFormResources();

    this.resources = {
      salutations,
      countries,
      nationality: countries,
      documentTypes: data.documentTypes,
      interests: data.characteristics,
      arrivalTypes: data.arrivalTypes,
      travelPurposes: data.travelPurposes
    };
  }

  @Loading(LoaderType.LOAD)
  private async loadForm(): Promise<void> {
    this.newForm.next();
    this.columns = getColumnsFields(
      () => this.openChooseGuestModal(),
      this.guest,
      this.birthDateTooltip
    );
    this.modifyColumns.emit(this.columns);

    this.form = new FormGroup({
      fields: new FormGroup(this.fields.reduce((group, [type, label, prop]) => {
        const value = prop in this.guest ? this.guest[prop as keyof GuestDetail] : null;

        return { ...group, [prop]: new FormControl(value)};
      }, {}))
    });
    this.updateFieldsValidators();
    const countryControl = this.form.get('fields.countryId');
    if (countryControl) {
      countryControl.valueChanges.pipe(
        untilDestroyed(this),
        takeUntil(this.newForm),
        distinctUntilChanged()
      ).subscribe(() => {
        this.updateFieldsValidators();
      });
    }
  }

  private async updateFieldsValidators(): Promise<void> {
    const {customer_country_id} = await this.cacheService.getCompanyDetails();
    const fieldsRequired: FieldKeys<GuestDetail>[] = getGuestValidationFields(
      this.validationLevel,
      +(this.form.get('fields.countryId') as FormControl).value,
      +customer_country_id
    );
    setFieldsValidators<GuestDetail>(
      this.columns as Fields<Guest>[],
      () => this.form ? +((this.form.get('fields') as FormGroup).get('countryId') as FormControl).value : this.guest.countryId,
      fieldsRequired
    );
    this.fields.forEach(field => {
      const control = this.form.get('fields.' + field[2]) as FormControl;
      if (control) {
        if (field[3] && field[3].validators) {
          control.setValidators(field[3].validators);
        } else {
          control.setValidators([]);
        }
      }
    });
    this.updateValidation(this.form);
  }

  private updateValidation(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      const group = (control as FormGroup);

      for (const field in group.controls) {
        if (group.controls.hasOwnProperty(field)) {
          const c = group.controls[field];
          this.updateValidation(c);
        }
      }
    } else if (control instanceof FormArray) {
      const group = (control as FormArray);

      for (const field in group.controls) {
        if (group.controls.hasOwnProperty(field)) {
          const c = group.controls[field];
          this.updateValidation(c);
        }
      }
    }

    control.updateValueAndValidity({ onlySelf: false });
  }

  async ngOnChanges({ guest }: SimpleChanges) {
    if (guest && guest.currentValue !== guest.previousValue) {
      this.loadResources(guest.currentValue.localeId);
      this.loadForm();
    }
  }

  ngOnDestroy(): void {}
}
