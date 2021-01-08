import { Pipe, PipeTransform } from '@angular/core';
import { isFriday, isMonday, isSaturday, isThursday, isTuesday, isWednesday } from 'date-fns';

@Pipe({
  name: 'weekday'
})
export class WeekdayPipe implements PipeTransform {

  transform(date: Date, cssClass?: boolean): string {
    let res = cssClass ? 'is-' : '';

    if (isMonday(date)) {
      res += 'monday';
    } else if (isTuesday(date)) {
      res += 'tuesday';
    } else if (isWednesday(date)) {
      res += 'wednesday';
    } else if (isThursday(date)) {
      res += 'thursday';
    } else if (isFriday(date)) {
      res += 'friday';
    } else if (isSaturday(date)) {
      res += 'saturday';
    } else {
      res += 'sunday';
    }

    return res;
  }

}
