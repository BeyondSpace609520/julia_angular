import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { addDays, isSameDay } from 'date-fns';

import { weekDays } from '@/app/main/window/shared/periods/consts';
import { SpecialOfferPeriod, SpecialOfferPricing } from '../../../models';
import { SpecialOfferPeriodView } from '../../../shared/periods/models';
import { extractWeekDay } from '../../../shared/periods/utils';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.pug',
  styleUrls: ['./periods.component.sass']
})
export class PeriodsComponent implements OnChanges {

  @Input() fromDate?: Date;
  @Input() untilDate?: Date;
  @Input() nights!: number;
  @Input() existingPeriods!: SpecialOfferPricing['periods'];
  @Input() arrivalDays!: boolean[];
  @Output() periodsChange = new EventEmitter<SpecialOfferPeriod[]>();

  public periods: SpecialOfferPeriodView[];
  public onlyChildren = true;

  ngOnChanges() {
    this.periods = [];

    if (!this.fromDate || !this.untilDate) { return; }

    for (
      let date = this.fromDate;
      addDays(date, this.nights).getTime() <= this.untilDate.getTime();
      date = addDays(date, 1)
    ) { // TODO date operations
      const untilDate = addDays(date, this.nights);
      const fromWeekDay = extractWeekDay(date);
      const untilWeekDay = extractWeekDay(untilDate);
      // TODO date operations
      const existPeriod = this.existingPeriods.find(p => isSameDay(p.fromDate, date) && isSameDay(p.untilDate, untilDate));

      if (this.arrivalDays[weekDays.findIndex(wd => wd.id === fromWeekDay.id)]) {
        this.periods.push({
          fromDate: date,
          untilDate,
          fromWeekDay,
          untilWeekDay,
          id: existPeriod ? existPeriod.id : 0,
          isChild: existPeriod ? existPeriod.isChild : true,
        });
      }
    }
    this.onlyChildren = Boolean(this.periods.every(p => p.isChild));
    this.periodsChange.emit(this.periods.map(period => {
      return {id: period.id, isChild: period.isChild, fromDate: period.fromDate, untilDate: period.untilDate};
    }));
  }
}
