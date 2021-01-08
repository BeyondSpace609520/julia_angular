import { Pipe, PipeTransform, Inject } from '@angular/core';
import {LanguageService, LANGUAGE_PROVIDER } from '../injection';
import {getMonth} from 'date-fns';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {

  constructor(@Inject(LANGUAGE_PROVIDER) private languageService: LanguageService) { }

  transform(date: Date, args?: any): string {
    const month = getMonth(date);
    return this.languageService.getMonthName(month + 1);
  }

}
