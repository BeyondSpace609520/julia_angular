import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { DaysState, SeasonPeriodConfig } from './models';

@Component({
  selector: 'app-period-config',
  templateUrl: './period-config.component.pug',
  styleUrls: ['./period-config.component.sass']
})
export class PeriodConfigComponent implements OnChanges, OnDestroy {

  @Input() config!: SeasonPeriodConfig | null;
  @Input() readonly = false;
  @Input() bookingCheckbox = true;

  form: FormGroup;

  days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];

  constructor() { }

  ngOnChanges() {
    const { config } = this;

    this.form = new FormGroup({
      minStay: new FormControl(config ? config.minStay : 1),
      maxStay: new FormControl(config ? config.maxStay : 28),
      allDaysChecked: new FormControl(config ? this.days.every(day => {
        return config.arrival[day] && config.departure[day];
      }) || false : false),
      days: new FormArray(this.days.map(day => {
        return new FormGroup({
          arrival: new FormControl(config ? config.arrival[day] : true),
          departure: new FormControl(config ? config.departure[day] : true)
        });
      })),
      useNightsMultiple: new FormControl(config ? config.useNightsMultiple : false),
      allowBooking: new FormControl(config ? config.allowBooking : false),
      allowEnquiry: new FormControl(config ? config.allowEnquiry : true),
      allowReservation: new FormControl(config ? config.allowReservation : true),
    });

    if (this.readonly) { this.form.disable(); }

    (this.form.get('allDaysChecked') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      const { controls } = (this.form.get('days') as FormArray);
      const checked = (this.form.get('allDaysChecked') as FormControl).value;

      controls.forEach(control => {
        (control.get('arrival') as FormControl).setValue(checked);
        (control.get('departure') as FormControl).setValue(checked);
      });
    });
    (this.form.get('days') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.updateAllDaysChecked());
    this.updateAllDaysChecked();
  }

  updateAllDaysChecked() {
    (this.form.get('allDaysChecked') as FormControl).setValue(this.days.every((day, i) => {
      return this.getDayControl(i, 'arrival').value && this.getDayControl(i, 'departure').value;
    }), {
      emitEvent: false
    });
  }

  public extractFormDetail(): SeasonPeriodConfig {
    const data = this.form.getRawValue();
    const arrival: DaysState = {} as any;
    const departure: DaysState = {} as any;

    this.days.map((day, i) => {
      arrival[day] = data.days[i].arrival;
      departure[day] = data.days[i].departure;
    });

    return {
      ...data,
      arrival,
      departure
    };
  }

  private getDayControl(i: number, type: 'arrival' | 'departure') {
    const array = this.form.get('days') as FormArray;

    return array.controls[i].get(type) as FormControl;
  }

  public anyDayChecked() {
    //  at least 1 day checked under "Arrival" and 1 day under "Departure"
    return this.days.some((_, i) => this.getDayControl(i, 'arrival').value)
      && this.days.some((_, i) => this.getDayControl(i, 'departure').value);
  }

  ngOnDestroy() {}
}
