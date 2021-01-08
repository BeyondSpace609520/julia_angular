import { Component, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { subscribeToFormStateChange } from '@/app/main/window/shared/forms/utils';
import { FormState } from '@/app/shared/forms/models';
import { ChargingSchemeCharges, ChargingSchemeChildCharge } from '../../../models';

@Component({
  selector: 'app-edit-charges',
  templateUrl: './charges.component.pug',
  styleUrls: ['./charges.component.sass']
})
export class ChargesComponent implements OnChanges, OnDestroy {
  private formState = new BehaviorSubject<FormState>({
    valid: true,
    dirty: false,
    touched: false
  });

  @Input() charges?: ChargingSchemeCharges;
  @Input() label: string;
  @Input() childFormGroupName: string;
  @Input() parentFormGroup: FormGroup;
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

  public form: FormGroup;

  get list() {
    return this.form.get('children') as FormArray;
  }

  constructor() {
    this.loadForm();
  }

  public add(item?: ChargingSchemeChildCharge): void {
    const ageGroupControl = new FormGroup({
      from: new FormControl(item ? item.from : ''),
      to: new FormControl(item ? item.to : ''),
      charge: new FormControl(item ? item.charge : '')
    });
    this.list.push(ageGroupControl);
    ageGroupControl.valueChanges.pipe(
      untilDestroyed(this),
      distinctUntilChanged((oldValues: ChargingSchemeChildCharge, newValues: ChargingSchemeChildCharge) => {
        return oldValues.from === newValues.from && oldValues.to === newValues.to && oldValues.charge === newValues.charge;
      })
    ).subscribe((values: ChargingSchemeChildCharge) => {
      const fromControl = ageGroupControl.get('from');
      const toControl = ageGroupControl.get('to');
      if (values.to >= 0 && values.to !== null && fromControl) {
        fromControl.setValidators([Validators.max(values.to)]);
        fromControl.updateValueAndValidity();
      }
      if (values.from >= 0 && values.from !== null && toControl) {
        toControl.setValidators([Validators.min(values.from)]);
        toControl.updateValueAndValidity();
      }
    });
  }

  public remove(): void {
    this.list.removeAt(this.list.length - 1);
  }

  public extract(): ChargingSchemeCharges {
    return this.form.getRawValue();
  }

  private loadForm(): void {
    this.form = new FormGroup({
      adult: new FormControl(this.charges ? this.charges.adult : 0),
      children: new FormArray([])
    });
    if (this.parentFormGroup && this.childFormGroupName) {
      this.parentFormGroup.addControl(this.childFormGroupName, this.form);
    }

    subscribeToFormStateChange(this, this.form, this.formState);
  }

  ngOnChanges({ charges }: SimpleChanges): void {
    if (!charges || charges.previousValue === charges.currentValue) { return; }

    this.loadForm();
    if (this.charges) {
      this.charges.children.forEach(child => this.add(child));
    }
  }

  ngOnDestroy(): void {
    if (this.parentFormGroup && this.childFormGroupName) {
      this.parentFormGroup.removeControl(this.childFormGroupName);
      this.parentFormGroup.updateValueAndValidity();
    }
  }
}
