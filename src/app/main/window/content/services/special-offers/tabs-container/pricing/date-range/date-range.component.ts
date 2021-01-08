import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { normalizeDateRange } from '@/app/main/window/shared/forms/utils';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.pug',
  styleUrls: ['./date-range.component.sass']
})
export class DateRangeComponent implements OnChanges, OnDestroy {

  @Input() title!: string;
  @Input() controls!: [FormControl, FormControl];

  get fromControl() {
    return this.controls[0];
  }

  get untilControl() {
    return this.controls[1];
  }

  ngOnChanges({ controls }: SimpleChanges) {
    if (controls && controls.previousValue !== controls.currentValue) {
      normalizeDateRange(this.fromControl, this.untilControl, untilDestroyed(this));
    }
  }

  ngOnDestroy() {}
}
