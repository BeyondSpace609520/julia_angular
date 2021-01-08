import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FormOption } from '@/app/main/shared/form-data.service';
import { Field } from '../builder';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.pug',
  styleUrls: ['./field.component.sass']
})
export class FieldComponent<Props, Resources extends string> {

  @Input() field!: Field<Props, Resources>;
  @Input() control!: FormControl;
  @Input() resources!: { [key in Resources]: FormOption[] };
  @Input() dependencies?: { key: string, field: string }[];
  @Input() group?: FormGroup;

  get options() {
    return this.field[3] || {};
  }

  public get iconClasses() {
    return {['mdi-' + this.options.icon]: true };
  }
}
