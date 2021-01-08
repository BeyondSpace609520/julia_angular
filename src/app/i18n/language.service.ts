import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService as ILangService } from 'easybooking-ui-kit/injection';
import { BehaviorSubject, Observable } from 'rxjs';

import { defaultLanguageId } from '../helpers/constants';
import { ServiceState } from '../helpers/models';
import { getNumericParam } from '../helpers/static.functions';

@Injectable()
export class LanguageService implements ILangService {
  //#region streams
  private languageId = new BehaviorSubject<number>(defaultLanguageId);
  public languageId$: Observable<number> = this.languageId.asObservable();
  private state = new BehaviorSubject<ServiceState>(ServiceState.Loading);
  public state$: Observable<ServiceState> = this.state.asObservable();
  //#endregion

  private userLanguageSet = false;

  constructor(
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang(extractLangKey(defaultLanguageId));
    this.setLanguage(getNumericParam(paramKey, true) || defaultLanguageId, true);
  }

  public async setLanguage(languageId: number, initial?: boolean): Promise<void> {
    localStorage.setItem(paramKey, String(languageId));
    const key = extractLangKey(languageId);
    if (!key) {
      return;
    }
    await this.translate.use(key).toPromise();
    this.languageId.next(languageId);
    this.registerLocaleModule(key);
    this.state.next(ServiceState.Ready);
    if (!initial) {
      this.userLanguageSet = true;
    }

  }

  public getLanguageCode(): string {
    return extractLangKey(this.getLanguageId());
  }

  public getLanguageId(zeroIfInitial?: boolean): number {
    if (!this.userLanguageSet && zeroIfInitial) {
      return 0;
    }
    return this.languageId.getValue();
  }

  public getWeekdayName(weekday: number): string {
    return '';
  }

  public getWeekdayShortName(weekday: number): string {
    return '';
  }

  public getMonthName(month: number): string {
    return 'january';
  }

  public getMonthShortName(month: number): string {
    return 'jan';
  }

  async registerLocaleModule(localeCode: string): Promise<void> {
    localeCode = localeCode.replace('_', '-');
    return import(`@angular/common/locales/${localeCode}.js`)
      .then(module => this.registerLocaleDataWithFix(module.default, localeCode))
      .catch(() => {
        const simpleLocaleCode = localeCode.substr(0, 2);
        if (simpleLocaleCode !== localeCode) {
          return this.registerLocaleModule(simpleLocaleCode);
        }
      })
      ;
  }

  private registerLocaleDataWithFix(data: any, localeCode: string): void {
    switch (localeCode) {
      case 'de-AT':
        // fix for at formats
        data[13][1] = '.'; // thousand separators
        data[13][12] = ','; // decimal separators
        break;
      case 'de':
        // fix for de formats
        data[13][0] = ','; // thousand separators
        data[13][1] = '.'; // decimal separators
        break;
    }
    registerLocaleData(data);
  }
}

const paramKey = 'language';

function extractLangKey(id: number): string {
  const keyValue = { 1: 'en_GB', 2: 'de_AT' };
  if (!id || !keyValue.hasOwnProperty(id)) {
    throw new Error(`Language ID #${id} is not defined`);
  }
  return keyValue[id];
}
