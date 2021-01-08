import { DecimalPipe } from '@angular/common';
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';
import { PriceFormat } from '../models';
import { format } from 'date-fns';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { convertCurrencyHtmlToCharacter } from '../utils/static.functions';
import { emailPattern } from '../utils/constants';
import { LANGUAGE_PROVIDER, LanguageService } from '../injection';

const defaultDecimals = 2;

@Injectable()
export class FormatService implements OnDestroy {
  public decimalSeparator: string;
  public thousandsSeparator: string;
  currencyPrefix: string;
  currencyPostfix: string;
  private currencyId: number;

  constructor(
    // private appService: AppService,
    @Inject(LANGUAGE_PROVIDER) private languageService: LanguageService,
    private translate: TranslateService,
    private decimalPipe: DecimalPipe,
  ) {
    this.detectSeparators();
    this.languageService.languageId$.pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(() => {
      this.detectSeparators();
    });
  }

  setCurrency(currencyId: number, currencyPrefix: string, currencyPostfix: string): void {
    this.currencyId = currencyId;
    this.currencyPrefix = parseCurrency(currencyPrefix);
    this.currencyPostfix = parseCurrency(currencyPostfix);
    this.detectSeparators();
  }

  /**
   * Add currency prefix and postfix to a formatted price
   */
  addCurrencyToFormattedPrice(price: string, separator: string = '&nbsp;'): string {
    const currency = (this.currencyPrefix ? this.currencyPrefix + separator : '')
      + price + (this.currencyPostfix ? separator + this.currencyPostfix : '');

    return convertCurrencyHtmlToCharacter(currency);
  }

  /**
   * Registers a FormControl input field to auto converts its content to number on the fly
   * @param {FormGroup} formGroup Root formgroup
   * @param {string}    fieldName Field name
   */
  autoNumberFieldFix(formGroup: FormGroup, fieldName: string) {
    (formGroup.get(fieldName) as FormControl).valueChanges.subscribe((newValue) => {
      const oldValue: string = formGroup.value[fieldName];
      const correctedValue: string = this.onAutoNumberFieldFixChange(oldValue, newValue);
      if (newValue !== correctedValue) {
        (formGroup.get(fieldName) as FormControl).setValue(correctedValue, {emitEvent: false});
      }
    });
  }

  /**
   * Parses a number from a formatted string
   * @param  {string} valueStr Formatted number
   * @return {number}          Parsed number
   */
  formattedNumberValue(valueStr: string | number | null): number | null {
    if (typeof valueStr === 'number') {
      return valueStr;
    }
    if (!valueStr || valueStr === '' || typeof valueStr !== 'string') {
      return null;
    }
    valueStr = valueStr.replace(new RegExp('\\'+this.thousandsSeparator, 'g'), '');
    valueStr = valueStr.replace(new RegExp('\\'+this.decimalSeparator, 'g'), '.');
    return +valueStr;
  }

  /**
   * Get a regexp pattern string to check date formatting
   */
  getDateFormatPatternStr(dateFormat: string): string {
    return dateFormat.split('.').join('\\.').replace('DD', '([0-9]{1,2})').replace('MM', '([0-9]{1,2})').replace('YYYY', '([0-9]{4})');
  }

  /**
   * Get a regexp pattern to check date formatting
   * @return {RegExp} Regular expression
   */
  getDateFormatPattern(dateFormat: string): RegExp {
    return new RegExp('^' + this.getDateFormatPatternStr(dateFormat) + '$');
  }

  /**
   * Returns with a  Date object from a date string
   */
  getFormattedDate(dateStr: string, dateFormat: string): Date | null {
    const match = dateStr.match(this.getDateFormatPattern(dateFormat));

    if (!match) {
      return null;
    }
    const [_, day, month, year] = match;

    if (+day === 0 || +month === 0 || +day === 0) {
      return null;
    } else {
      return new Date(+year, +month - 1, +day);
    }
  }

  /**
   * Get a regexp pattern to check a formatted string
   * @param  {boolean=false}       negative If it allows negative numbers
   * @return {RegExp}                       Regular expression
   */
  getNumberFormatPattern(negative: boolean = false): RegExp {
    const negativeStr: string = (negative) ? '-?' : '';
    const thousandsSeparator = (this.thousandsSeparator === '.')
      ? '\\' + this.thousandsSeparator + '?'
      : this.thousandsSeparator + '?';
    const decimalSeparator = (this.decimalSeparator === '.')
      ? '\\' + this.decimalSeparator
      : this.decimalSeparator;
    return new RegExp('^' + negativeStr + '[0-9]{1,3}(' + thousandsSeparator + '[0-9]{3})*(' + decimalSeparator + '[0-9]+)?$');
  }

  /**
   * Converts a FormControl input field value to a formatted number based on the numberFormat setting
   * @param {FormControl} formControl Input field
   */
  numberFieldFormat(formControl: FormControl) {
    let valueStr: string | null = formControl.value;
    valueStr = this.numberFieldFormatParse(valueStr);
    const value: number | null = this.formattedNumberValue(valueStr);
    if (value !== null) {
      formControl.setValue(this.numberFormat(value));
    } else {
      formControl.setValue('');
    }
  }

  /**
   * Parses the input string to match the numberFormat setting
   * @param  {string} valueStr Input string
   * @return {string}          Parsed string
   */
  private numberFieldFormatParse(valueStr: string | null): string | null {
    if (!valueStr || valueStr === '') {
      return null;
    }
    if (valueStr.indexOf(this.thousandsSeparator) >= 0 && valueStr.indexOf(this.decimalSeparator) < 0) {
      let sep: string = this.thousandsSeparator;
      if (sep === '.') {
        sep = '\\.';
      }
      if (!valueStr.match(new RegExp('^[0-9]*(' + sep + '[0-9]{3})+$'))) {
        valueStr.replace(this.thousandsSeparator, this.decimalSeparator);
      }
    }
    return valueStr;
  }

  /**
   * Round a number
   * @param  {number} value    Number to round
   * @param  {number} decimals Decimals
   * @return {number}          Rounded number
   */
  roundNumber(value: number, decimals: number): number {
    const num = parseFloat(value + 'e+' + decimals);
    return (+(Math.round(num) + 'e-' + decimals));
  }

  /**
   * Format a number based on the current format pattern
   * @param  {number}        value               Number to format
   * @param  {number=2}      decimals            Number of decimals
   * @param  {boolean=false} thousandsSeparators If to use thousand separators
   * @return {string}                            Formatted number
   */
  numberFormat(value: number, decimals: number = 2, thousandsSeparators: boolean = false): string | null {
    if (isNaN(value)) {
      return null;
    }
    value = this.roundNumber(value, decimals);
    const parts = value.toString().split('.');
    if (thousandsSeparators) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    }
    if (decimals === 0) {
      return parts[0];
    }
    if (parts.length > 1) {
      while (parts[1].length < decimals) {
        parts[1] += '0';
      }
    } else {
      parts[1] = '';
      for (let i = 0; i < decimals; i++) {
        parts[1] += '0';
      }
    }
    return parts[0] + this.decimalSeparator + parts[1];
  }

  /**
   * Event handler for autoNumberFieldFix, formats the value to number, or keeps the old value if it fails
   * @param  {string} oldValue Value before the change
   * @param  {string} newValue Value after the change
   * @return {string}          Formatted value
   */
  private onAutoNumberFieldFixChange(oldValue: string, newValue: string): string {
    if (!newValue) {
      return newValue;
    }
    newValue = newValue.replace(/\s/g, '');
    const valueMatch: RegExpMatchArray | null = newValue.match(/-?[0-9]*(\.[0-9]{3})*[.,]?[0-9]*/);
    if (!valueMatch || valueMatch[0] === '') {
      newValue = oldValue;
    } else {
      newValue = valueMatch[0];
      if (newValue.indexOf(this.thousandsSeparator) >= 0 && newValue.indexOf(this.decimalSeparator) >= 0) {
        newValue = newValue.split(this.thousandsSeparator).join('');
      } else if (newValue.indexOf(this.thousandsSeparator)) {
        newValue = newValue.split(this.thousandsSeparator).join(this.decimalSeparator);
      }
    }
    return newValue;
  }

  /**
   * Converts a value to a formatted price, based on numberformat and currency settings
   * @param  {number}          value     Value to format
   * @param  {number=2}        decimals  Number of decimals
   * @param  {string='&nbsp;'} separator Separator to use for prefix and postfix
   * @return {string}                    Formatted price
   */
  priceFormat(value: number, decimals: number = 2, separator: string = '&nbsp;', withSign?: boolean): string {
    const sign = (value < 0) ? ' - ' : ' + ';
    if (withSign) {
      value = Math.abs(value);
    }
    const parts: PriceFormat = this.priceFormatParts(value, decimals, separator);
    if (withSign) {
      return sign + convertCurrencyHtmlToCharacter(parts.prefix + parts.value + parts.postfix);
    } else {
      return convertCurrencyHtmlToCharacter(parts.prefix + parts.value + parts.postfix);
    }
  }

  /**
   * Converts a value to a formatted price, and defines prefix and postfix
   * @param  {number}          value     Value to format
   * @param  {number=2}        decimals  Number of decimals
   * @param  {string=' '}      separator Separator to use for prefix and postfix
   * @return {PriceFormat}               Formatted price parts
   */
  priceFormatParts(value: number, decimals: number = 2, separator: string = ' '): PriceFormat {
    const valueFormat: string | null = this.numberFormat(value, decimals, true);
    return {
      value: valueFormat || '',
      prefix: this.currencyPrefix ? this.currencyPrefix + separator : '',
      postfix: this.currencyPostfix ? separator + this.currencyPostfix : ''
    };
  }

  /**
   * Converts a value to a formatted percentage, based on numberformat
   * @param  {number}          value     Value to format
   * @param  {number=2}        decimals  Number of decimals
   * @return {string}                    Formatted price
   */
  percentFormat(value: number, decimals: number = 2): string {
    const valueFormat: string | null = this.numberFormat(value, decimals, true);
    return `${valueFormat} %`;
  }

  /**
   * Formats date based on the appSettings.customDateFormat setting
   */
  dateFormat(date: Date, dateFormat: string): string | null {
    if (!date) {
      return null;
    }
    // if (this.appService && this.appService.appSettings && this.appService.appSettings.customDateFormat) {
    //   dateFormat = this.appService.appSettings.customDateFormat;
    // }
    return format(date, dateFormat);
  }

  getCurrentDay(date: Date): string | null {
    if (!date) {
      return null;
    }
    let str = format(date, 'DD');
    if (this.languageService.getLanguageCode().toLowerCase().startsWith('en')) {
      str += '.';
    }
    return str;
  }

  getCurrentYear(date: Date): string | null {
    if (!date) {
      return null;
    }
    return format(date, 'YYYY');
  }

  getEmailPattern(): RegExp {
    return new RegExp(emailPattern);
  }


  /**
   * Prepare the content of the mouseover popover
   */
  getItemPopoverContent(text): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!text) {
        reject();
      }
      // look for parts need to be replaced
      const brackets = text.match(/\[[^\]]+\]/g);
      if (!brackets) {
        // no replaceable content, return it immediately
        resolve(text);
      } else {
        const toTranslate: string[] = [];
        // check all parts to be replaced
        brackets.forEach((expression: string) => {
          // remove brackets from beginning and end
          expression = expression.replace(/^\[/, '').replace(/\]$/, '');
          const parts: string[] = expression.split(':');
          if (parts.length === 1) {
            // needs to be translated
            toTranslate.push(expression);
          } else if (parts.length > 1) {
            switch (parts[0]) {
              case 'currency':
                // needs to be replaced by currency format
                const currencyStr: string = this.priceFormat(+parts[1]);
                text = text.split('[' + expression + ']').join(currencyStr);
                break;
            }
          }
        });
        if (toTranslate.length > 0) {
          // translate parts
          this.translate.get(toTranslate).subscribe((result) => {
            for (const key in result) {
              if (result.hasOwnProperty(key)) {
                let translation: string = key;
                if (typeof result[key] === 'string') {
                  translation = result[key];
                } else if ('text' in result[key]) {
                  translation = result[key].text;
                }
                text = text.split('[' + key + ']').join(translation);
              }
            }
            // everything is translated
            resolve(text);
          });
        } else {
          resolve(text);
        }
      }
    });
  }

  private detectSeparators(): void {
    if (this.currencyId === 2) { // Switzerland
      this.decimalSeparator = '.';
      this.thousandsSeparator = '\'';
      return;
    }

    if (['de', 'de_AT'].includes(this.languageService.getLanguageCode())) {
      this.decimalSeparator = ',';
      this.thousandsSeparator = '.';
      return;
    }

    this.decimalSeparator = '.';
    this.thousandsSeparator = ',';

    // const localeCode = await this.languageService.getLanguageCode().replace('_', '-');
    // this.languageService.registerLocaleModule(localeCode);
    // const decimalHelper = this.numberPipeFormat(1.1, 1, localeCode);
    // this.decimalSeparator = decimalHelper ? decimalHelper.split('1').join('') : '.';
    // const thousandHelper = this.numberPipeFormat(1111, 0, localeCode);
    // this.thousandsSeparator = thousandHelper ? thousandHelper.split('1').join('') : ',';
  }

  private numberPipeFormat(value: number, decimals: number = 2, localeCode: string): string | null {
    const digits = getNumberFormatDigits(decimals);
    return this.decimalPipe.transform(value, digits, localeCode);
  }

  ngOnDestroy(): void { }
}

function getNumberFormatDigits(decimals: number): string {
  if (decimals === undefined || decimals === null) {
    decimals = defaultDecimals;
  }
  return '1.' + decimals + '-' + decimals;
}

function parseCurrency(currencyCode: string): string {
  if (currencyCode === '&euro;') {
    return '€';
  }
  return currencyCode;
}
