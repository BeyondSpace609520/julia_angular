import { InjectionToken, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

export interface LanguageService {
  languageId$: Observable<number>;
  getLanguageCode(): string;
  getWeekdayName(weekday: number);
  getWeekdayShortName(weekday: number);
  getMonthName(month: number): string;
  getMonthShortName(month: number);
  registerLocaleModule(localeCode: string);
}

export const LANGUAGE_PROVIDER = new InjectionToken<LanguageService>('LanguageService');

export interface PipeDate extends PipeTransform {
  getFormat(): string;
}

export const DATE_FORMAT_PROVIDER = new InjectionToken<PipeDate>('DateFormatPipe');

