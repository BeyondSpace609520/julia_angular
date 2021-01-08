import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { addDays } from 'date-fns';

export interface Checkbox {
  id: string;
  label: string;
  value?: boolean;
}

export interface SearchData {
  from: Date;
  to: Date;
  checkboxes: {id: string, value: boolean}[];
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.pug',
  styleUrls: ['./search-bar.component.sass']
})
export class SearchBarComponent implements OnInit, OnChanges {

  @Input() fromDate?: Date;
  @Input() untilDate?: Date;
  @Input() fromDayShift = 7;
  @Input() checkboxes!: Checkbox[];
  @Input() refreshInsteadOfGo = false;
  @Output() search = new EventEmitter<SearchData>();

  form: FormGroup;

  constructor() { }

  ngOnChanges({checkboxes}: SimpleChanges) {
    if (!this.untilDate) {
      this.untilDate = new Date();
    }
    if (!this.fromDate) {
      this.fromDate = addDays(this.untilDate, -this.fromDayShift);
    }

    if (checkboxes.currentValue !== checkboxes.previousValue) {
      this.form = new FormGroup({
        from: new FormControl(this.fromDate),
        to: new FormControl(this.untilDate),
        checkboxes: new FormArray(this.checkboxes.map(ch =>
          new FormControl(ch.value || false)
        ))
      });
    }
  }

  onSearch() {
    this.search.emit({
      from: (this.form.get('from') as FormControl).value as Date,
      to: (this.form.get('to') as FormControl).value as Date,
      checkboxes: (this.form.get('checkboxes') as FormArray).controls.map((ch, i) => ({
        id: this.checkboxes[i].id,
        value: Boolean(ch.value)
      }))
    });
  }

  ngOnInit() {
    this.onSearch();
  }
}
