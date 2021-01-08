import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  // ValidatorFn,
} from '@angular/forms';

import { flatten } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { HotelRegistrationRecord } from '../../../../guest-registration/models';
import { GuestRegistrationConfigService } from '../../../guest-registration-config.service';
import { CompanyDetailsFormValues } from '../../../models';
import { getFieldValidators } from './get-field-validators';
import { setupFields } from './setup-fields';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.pug',
  styleUrls: ['./company-details.component.sass'],
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public fields: (MainFieldSettings | undefined)[][] = [];
  public isLoading: Observable<boolean>;
  public guestRegistrationProviderId: HotelRegistrationRecord['guestRegistrationProviderId'];
  public desklineEditionV3: HotelRegistrationRecord['desklineEditionV3'];

  private formChanged = new Subject();

  constructor(
    public guestRegistrationConfigService: GuestRegistrationConfigService
  ) {}

  private createNewForm(selectedHotel: HotelRegistrationRecord): void {
    this.fields = this.setupFields(+selectedHotel.guestRegistrationProviderId);
    this.guestRegistrationProviderId =
      +selectedHotel.guestRegistrationProviderId;
    const form = this.prepareForm(selectedHotel);
    this.initForm(form);
    this.guestRegistrationConfigService.setCompanyForm(form);
  }

  private initForm(form: FormGroup): void {
    this.formChanged.next();
    this.form = form;
    const guestRegistrationProviderIdField = this.form.get(
      'guestRegistrationProviderId'
    ) as FormControl;
    const desklineEditionV3Field = this.form.get(
      'desklineEditionV3'
    ) as FormControl;
    if (!guestRegistrationProviderIdField || !desklineEditionV3Field) {
      return;
    }

    this.setupMandatoryFields(
      +guestRegistrationProviderIdField.value,
      desklineEditionV3Field.value ? true : false
    );

    guestRegistrationProviderIdField.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.formChanged))
      .subscribe((guestRegistrationProviderId) => {
        this.fields = this.setupFields(
          +guestRegistrationProviderId
        );
        this.guestRegistrationProviderId = +guestRegistrationProviderId;
        this.setupMandatoryFields(
          this.guestRegistrationProviderId,
          this.desklineEditionV3
        );
      });

    if (desklineEditionV3Field) {
      desklineEditionV3Field.valueChanges
        .pipe(distinctUntilChanged(), takeUntil(this.formChanged))
        .subscribe((desklineEditionV3) => {
          this.desklineEditionV3 = desklineEditionV3 ? true : false;
          this.setupMandatoryFields(
            this.guestRegistrationProviderId,
            this.desklineEditionV3
          );
        });
    }
  }

  private prepareForm(selectedHotel: HotelRegistrationRecord): FormGroup {
    const form = new FormGroup({});
    flatten(this.fields).forEach((field) => {
      if (field) {
        if (selectedHotel.hasOwnProperty(field.name)) {
          addControl(
            form,
            field.name,
            selectedHotel[field.name],
            field.disabled || false
          );
          if (
            field.extraField &&
            selectedHotel.hasOwnProperty(field.extraField.name)
          ) {
            addControl(
              form,
              field.extraField.name,
              selectedHotel[field.extraField.name],
              field.disabled || false
            );
          }
        }
      }
    });
    return form;
  }

  private setupFields(
    guestRegistrationProviderId?: HotelRegistrationRecord['guestRegistrationProviderId'],
    // desklineEditionV3?: HotelRegistrationRecord['desklineEditionV3']
  ): (MainFieldSettings | undefined)[][] {
    return setupFields(
      this.guestRegistrationConfigService.providers,
      guestRegistrationProviderId,
      // desklineEditionV3,
      this.guestRegistrationConfigService.isAdmin
    );
  }

  private setupMandatoryFields(
    guestRegistrationProviderId: HotelRegistrationRecord['guestRegistrationProviderId'],
    desklineEditionV3: HotelRegistrationRecord['desklineEditionV3']
  ): void {
    flatten(this.fields).forEach((field) => {
      if (!field) {
        return;
      }
      const formControl: FormControl = this.form.get(field.name) as FormControl;
      if (!formControl) {
        return;
      }
      // validators are set within setupFields now
      const validators = getFieldValidators(
        field.name,
        guestRegistrationProviderId,
        desklineEditionV3
      );
      // const validators = field.validators;
      if (!validators || validators.length === 0) {
        formControl.clearValidators();
      } else {
        formControl.setValidators(validators);
      }
      formControl.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.guestRegistrationConfigService.selectedHotel
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged((oldHotel, newHotel) => {
          if (!oldHotel && !newHotel) {
            return true;
          }
          if (!oldHotel || !newHotel) {
            return false;
          }
          return oldHotel.id === newHotel.id;
        })
      )
      .subscribe((newSelectedHotel) => {
        if (this.form && newSelectedHotel) {
          this.createNewForm(newSelectedHotel);
        }
      });
    const form = this.guestRegistrationConfigService.getCompanyForm();
    const selectedHotel = this.guestRegistrationConfigService.getSelectedHotel();
    if (form) {
      // TODO - check if we actually needs this here?
      // this.fields = this.setupFields(
      //   selectedHotel ? selectedHotel.guestRegistrationProviderId : undefined
      // );
      this.initForm(form);
    } else if (selectedHotel) {
      this.createNewForm(selectedHotel);
    }
    if (this.form) {
      const values = this.form.getRawValue();
      this.guestRegistrationProviderId = +values.guestRegistrationProviderId;
      this.desklineEditionV3 = values.desklineEditionV3;
    }
  }

  ngOnDestroy(): void {}
}

export interface FieldSettings {
  name: keyof CompanyDetailsFormValues;
  type: 'text' | 'password' | 'select' | 'checkbox';
  label?: string;
  isLabelStatic?: boolean;
  selectOptions?: { id: number; name: string }[];
  disabled?: boolean;
  tooltip?: string;
  // validators?: ValidatorFn | ValidatorFn[] | null;
}

export interface MainFieldSettings extends FieldSettings {
  label: string;
  extraField?: FieldSettings;
}

function addControl(form: FormGroup, name: string, value: any, disabled: boolean): void {
  form.addControl(name, new FormControl({ value, disabled }));
}
