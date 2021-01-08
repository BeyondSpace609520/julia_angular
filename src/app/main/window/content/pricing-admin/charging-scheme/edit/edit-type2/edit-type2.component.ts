import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ChargingSchemeBody, ChargingSchemeDetail, ChargingSchemeType2 } from '../../models';
import { ChargesComponent } from '../shared/charges/charges.component';
import { GeneralComponent } from '../shared/general/general.component';
import { TranslationsComponent } from '../shared/translations/translations.component';
import { Editor } from '../types';
import { Observable, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-type2',
  templateUrl: './edit-type2.component.pug',
  styleUrls: ['./edit-type2.component.sass']
})
export class EditType2Component implements Editor, OnChanges {

  @Input() scheme?: ChargingSchemeDetail<ChargingSchemeType2>;

  form: FormGroup;

  @ViewChild('general', { static: false }) general: GeneralComponent;
  @ViewChild('charges', { static: false }) charges: ChargesComponent;
  @ViewChild('translations', { static: false }) translations: TranslationsComponent;

  get chargeLabel() {
    return (this.form.get('chargeType') as FormControl).value === 'PercOnTotal' ? '%' : '€';
  }

  ngOnChanges() {
    this.form = new FormGroup({
      chargeType: new FormControl(this.scheme ? this.scheme.chargeType : 'PricePerPersonPerNight'),
    });
  }

  public isValid(): Observable<boolean> {
    return merge(this.general.form.valueChanges, this.form.valueChanges, this.translations.form.valueChanges).pipe(
      startWith(null),
      map(() => this.general.form.valid && this.form.valid && this.translations.form.valid)
    );
  }

  public extract(): ChargingSchemeBody<ChargingSchemeDetail<ChargingSchemeType2>> {
    const { name, startDate, endDate } = this.general.extract();
    const { chargeType } = this.form.getRawValue();

    return {
      id: this.scheme ? this.scheme.id : undefined,
      name, startDate, endDate,
      chargeType,
      charges: this.charges.extract(),
      translations: this.translations.extract(),
      type: 'ExtraChargeOverPeriod'
    };
  }
}
