import { Pipe, PipeTransform, Inject } from '@angular/core';
import {LanguageService, LANGUAGE_PROVIDER} from '../injection';
import {getISODay} from 'date-fns';

@Pipe({
  name: 'dayShortName'
})
export class DayShortNamePipe implements PipeTransform {

  constructor(@Inject(LANGUAGE_PROVIDER) private languageService: LanguageService) { }

  transform(date: Date, args?: any): string {
      const weekday = getISODay(date);
      return this.languageService.getWeekdayShortName(weekday);
  }
}
