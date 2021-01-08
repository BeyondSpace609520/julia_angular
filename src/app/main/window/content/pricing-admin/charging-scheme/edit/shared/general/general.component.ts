import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { normalizeDateRange } from '@/app/main/window/shared/forms/utils';
import { ChargingSchemeGeneral } from '../../../models';

@Component({
  selector: 'app-edit-general',
  templateUrl: './general.component.pug',
  styleUrls: ['./general.component.sass']
})
export class GeneralComponent implements OnChanges, OnDestroy {

  @Input() data?: ChargingSchemeGeneral;

  form: FormGroup;

  constructor() { }

  ngOnChanges({ data }: SimpleChanges) {
    if (data.currentValue === data.previousValue) { return; }

    this.form = new FormGroup({
      name: new FormControl(this.data ? this.data.name : '', Validators.required),
      startDate: new FormControl(this.data ? this.data.startDate : null, Validators.required),
      endDate: new FormControl(this.data ? this.data.endDate : null, Validators.required),
    });
    (window as any).form = this.form;
    normalizeDateRange(this.form.get('startDate') as FormControl, this.form.get('endDate') as FormControl, untilDestroyed(this));
  }

  extract(): ChargingSchemeGeneral {
    return this.form.getRawValue();
  }

  ngOnDestroy() {}
}
