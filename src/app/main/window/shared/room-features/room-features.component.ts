import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import features, { bedFeatures, FeatureColumn } from './features';
import { RawFeature } from './models';
import { prepareBody } from './reduce';

@Component({
  selector: 'app-shared-room-features',
  templateUrl: './room-features.component.pug',
  styleUrls: ['./room-features.component.sass']
})
export class RoomFeaturesComponent implements OnChanges {

  @Input() data: RawFeature;

  form: FormArray;
  columns = features;

  constructor() { }

  ngOnChanges() {
    if (this.data) {
      this.loadForm(this.data);
    }
  }

  loadForm(featureData: RawFeature) {
    this.form = new FormArray(this.columns.map(column => {
      const group = {};
      column.map(item => {
        if ('key' in item) {
          group[item.key] = this.createControl(featureData, item);
        }
      });

      return new FormGroup(group);
    }));
  }

  getControl(i: number, key: string) {
    return this.form.controls[i].get(key);
  }

  createControl(featureData: RawFeature, column: FeatureColumn) {
    if (!('key' in column)) { throw new Error('key not found'); }

    const value = featureData[column.key];

    switch (column.type) {
      case 'checkbox': return new FormControl(value === 'on');
      case 'number': return new FormControl(+value);
      case 'string': return new FormControl(value);
    }
  }

  public extractBody() {
    const body = prepareBody(this.form.getRawValue()); // [WARN]
    const noBeds = !bedFeatures.some(({ key }) => body[key] > 0);

    return { body, noBeds };
  }
}
