import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { ChargingSchemeTranslation } from '../../../models';

@Component({
  selector: 'app-edit-translations',
  templateUrl: './translations.component.pug',
  styleUrls: ['./translations.component.sass']
})
export class TranslationsComponent implements OnChanges {

  @Input() list?: ChargingSchemeTranslation[];

  form: FormArray;
  locals: FormOption[];

  constructor(private formData: FormDataService) {
    this.locals = this.formData.getLocals();
  }

  ngOnChanges({ list }: SimpleChanges) {
    if (list.currentValue === list.previousValue) { return; }

    this.form = new FormArray(this.locals.map(locale => {
      const record = this.list ? this.list.find(item => item.localeId === +locale.value) : null;

      return new FormControl(record ? record.text : '');
    }));
  }

  extract(): ChargingSchemeTranslation[] {
    return this.locals.map(({ value }, i) => ({
      localeId: +value,
      text: (this.form.at(i) as FormControl).value,
    }) as ChargingSchemeTranslation);
  }
}
