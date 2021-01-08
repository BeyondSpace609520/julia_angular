// import {CalendarsItemType} from '../../calendars/calendars.models';
import { AbstractControl } from '@angular/forms';
// import {environment} from '../../../environments/environment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {getDate, getMonth, getYear} from 'date-fns';

// export function getImageUrl(imagePath: string, width?: number, height?: number, crop: boolean = true): string {
//   if (!imagePath || imagePath === '') {
//     return null;
//   }
//   let url = environment.mediaServerBaseUrl + 'phpThumb/phpThumb.php?src=' + encodeURI(imagePath);
//   if (width > 0) {
//     url += '&w=' + width;
//   }
//   if (height > 0) {
//     url += '&h=' + height;
//   }
//   if (width > 0 && height > 0 && crop) {
//     url += '&zc=1';
//   }
//   return url;
// }

/**
 * Create URL from path
 */
export function getPDFUrl(path: string): string | null {
  if (!path || path === '') {
    return null;
  }
  // path = path.replace('/var/www/html/', environment.fileServerBaseUrl);
  return path;
}

/**
 * Applies rules to style-classes
 * @param {StyleRulesMap} rulesMap Style rules
 */
export function applyStyles(rulesMap: StyleRulesMap) {
  for (let i = 0; i < document.styleSheets.length; i++) {
    const css: CSSStyleSheet = document.styleSheets[i] as CSSStyleSheet;
    if (css) {
      const rules: CSSRuleList = css.cssRules ? css.cssRules : css.rules;
      if (rules) {
        for (let r = 0; r < rules.length; r++) {
          const thisRule: CSSStyleRule = rules[r] as CSSStyleRule;
          if (rulesMap[thisRule.selectorText]) {
            for (const rule of rulesMap[thisRule.selectorText]) {
              thisRule.style[rule.property] = rule.value;
            }
          }
        }
      }
    }
  }
}

/**
 * Create css classes on the fly
 */
export function createCssClass(name: string, rules: string) {
  const style = document.createElement('style');
  style.type = 'text/css';
  document.getElementsByTagName('head')[0].appendChild(style);
  const sheet = style.sheet as CSSStyleSheet;
  sheet.insertRule(name + '{' + rules + '}', 0);
}

/**
 * Get rgba color string from hexa color
 */
export function rgba(input: string, alpha: number): string {
  const r: number = parseInt('0x' + input.substr(1, 2), 16);
  const g: number = parseInt('0x' + input.substr(3, 2), 16);
  const b: number = parseInt('0x' + input.substr(5, 2), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

/**
 * Check if bookings item is a type of booking item
 */
// export function isBookingType(type: CalendarsItemType): boolean {
//   return (type === CalendarsItemType.enquiry || type === CalendarsItemType.reservation || type === CalendarsItemType.booking);
// }

/**
 * Check if bookings item is a type of block item
 */
// export function isBlockType(type: CalendarsItemType): boolean {
//   return (type === CalendarsItemType.block || type === CalendarsItemType.contingent);
// }

export interface StyleRulesMap {
  [ruleName: string]: { property: string; value: string; }[];
}

/**
 * Create HTML output of icon type
 */
export function iconHtml(type: string, classNames?: string[]): string | null {
  if (!classNames) {
    classNames = [];
  }
  if (type.match(/^mdi-/)) {
    classNames.unshift('mdi ' + type);
    return '<i class="' + classNames.join(' ') + '"></i>';
  }
  return null;
}

/**
 * Clone object
 */
export function cloneObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Clone array
 */
export function cloneArray<T>(array: T[]): T[] {
  return array.slice(0);
}

/**
 * Compares two objects
 *
 * Doesn't work on objects with functions
 */
export function compareObjects(object1: any, object2: any): boolean {
  return JSON.stringify(object1) === JSON.stringify(object2);
}

/**
 * Compares two arrays
 */
export function compareArrays(array1: any[], array2: any[]): boolean {
  return JSON.stringify(array1) === JSON.stringify(array2);
}

/**
 * Deep extension of an object with another
 */
export function extendObject(target: any, extension: any, extendArrays?: boolean, skipNull?: boolean, skipIt?: string[]) {
  if (!extension) {
    // if extension is empty
    return target;
  }
  if (typeof target !== 'object' || typeof target !== 'object') {
    // if any of the parametes is not an object
    return extension;
  }
  // loop the keys of the extension object
  Object.keys(extension).forEach(key => {
    if (!target.hasOwnProperty(key) || target[key] === null || typeof target[key] === 'undefined') {
      // if the target object doesn't have the key or it's empty
      if (!skipIt || !skipIt.includes(key)) {
        target[key] = extension[key];
      }
    } else if (typeof target[key] === typeof extension[key]) {
      // if the types of the target field and extension field match
      if (typeof extension[key] === 'object' || Array.isArray(extension[key])) {
        if (Array.isArray(extension[key])) {
          // if the field is array
          if (extendArrays) {
            // extend it
            if (!skipIt || !skipIt.includes(key)) {
              target[key] = target[key].concat(extension[key]);
            }
          } else {
            // overwrite it
            if (!skipIt || !skipIt.includes(key)) {
              target[key] = extension[key];
            }
          }
        } else {
          // if the field is object extend it
          if (!skipIt || !skipIt.includes(key)) {
            target[key] = extendObject(target[key], extension[key], extendArrays, skipNull, skipIt);
          }
        }
      } else {
        // if the field is not an object or array simply overwrite it
        if (!skipNull || extension[key] !== null) {
          if (!skipIt || !skipIt.includes(key)) {
            target[key] = extension[key];
          }
        }
      }
    }
  });
  return target;
}

/**
 * Open browser's print dialog
 */
export function printApp() {
  window.focus();
  window.print();
}

/**
 * Converts an NgbDateStruct to Date
 */
export function convertDateStructToDate(struct: NgbDateStruct): Date {
  return new Date(struct.year, struct.month - 1, struct.day);
}


/**
 * Converts a Date to NgbDateStruct
 */
export function convertDateToDateStruct(date: Date): NgbDateStruct {
  return {
    year: getYear(date),
    month: getMonth(date) + 1,
    day: getDate(date)
  };
}

export function isOnSameDay(date1: Date, date2: Date): boolean {
  return getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2) && getDate(date1) === getDate(date2);
}

/**
 * Remove <p> tags and restore <br> tags
 */
export function parseHtmlContentsAfterEditor(html: string): string {
  if (html.match(/^<p>(.*)<\/p>$/)) {
    html = html.replace(/<br>/g, '');
    html = html.replace(/<p[^>]*>/g, '');
    html = html.replace(/<\/p>/g, '<br>');
  }
  return html;
}

/**
 * Recursively check if an object has a property
 *
 * propertyName is an array of strings concatenated by '.'
 */
export function hasObjectOwnPropertyRecursive(object: any, propertyName: string): boolean {
  const propertyNameArray = propertyName.split('.');
  if (propertyNameArray.length === 1) {
    // if the property name doesn't have any '.' means that it's on the current level
    return object.hasOwnProperty(propertyName);
  }
  const property = propertyNameArray.shift() as string;
  if (!object.hasOwnProperty(property)) {
    // the object doesn't even have one of the parent levels
    return false;
  }
  if (typeof object[property] !== 'object') {
    // the current property doesn't have children properties
    return false;
  }
  // check recursively further
  return hasObjectOwnPropertyRecursive(object[property], propertyNameArray.join('.'));
}

export function getObjectPropertyRecursive(object: any, propertyName: string): any {
  const propertyNameArray = propertyName.split('.');
  const property = propertyNameArray.shift() as string;
  if (!object.hasOwnProperty(property)) {
    return undefined;
  }
  if (propertyNameArray.length === 0) {
    // it's on the current level
    return object[property];
  } else {
    // continue recursion
    return getObjectPropertyRecursive(object[property], propertyNameArray.join('.'));
  }
}

/**
 * Updates an object's property by it's name recursively
 *
 * propertyName is an array of strings concatenated by '.'
 */
export function setObjectPropertyRecursive(object: any, propertyName: string, newValue: any) {
  const propertyNameArray = propertyName.split('.');
  const property = propertyNameArray.shift() as string;
  if (propertyNameArray.length === 0) {
    // it's on the current level
    object[property] = newValue;
  } else {
    // continue recursion
    setObjectPropertyRecursive(object[property], propertyNameArray.join('.'), newValue);
  }
}

export function roundTo(value: number, roundToNumber: number) {
  return Math.round(value / roundToNumber) * roundToNumber;
}

export function scrollLeftAnimated(element: HTMLElement, scrollX, duration = 400) {
  return new Promise(resolve => {
    const start = element.scrollLeft,
      change = scrollX - start,
      increment = 20;

    const animateScroll = (elapsedTime) => {
      elapsedTime += increment;
      element.scrollLeft = easeInOut(elapsedTime, start, change, duration);
      if (elapsedTime < duration) {
        setTimeout(() => {
          animateScroll(elapsedTime);
        }, increment);
      } else {
        resolve();
      }
    };

    animateScroll(0);
  });
}

export function scrollTopAnimated(element: HTMLElement, scrollY, duration = 400) {
  return new Promise(resolve => {
    const start = element.scrollTop,
      change = scrollY - start,
      increment = 20;

    const animateScroll = (elapsedTime) => {
      elapsedTime += increment;
      element.scrollTop = easeInOut(elapsedTime, start, change, duration);
      if (elapsedTime < duration) {
        setTimeout(() => {
          animateScroll(elapsedTime);
        }, increment);
      } else {
        resolve();
      }
    };

    animateScroll(0);
  });
}

function easeInOut(currentTime, start, change, duration) {
  currentTime /= duration / 2;
  if (currentTime < 1) {
    return change / 2 * currentTime * currentTime + start;
  }
  currentTime -= 1;
  return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
}

/**
 * Replaces every html encoded characters in price
 */
export function convertCurrencyHtmlToCharacter(input: string): string {
  input = input.split('&nbsp;').join(' ');
  input = input.split('&euro;').join('€');
  input = input.split('&#163;').join('£');
  return input;
}

export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (!abstractControl) {
    return false;
  }

  if (abstractControl.validator) {
    const validator = abstractControl.validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
  }

  if (abstractControl['controls']) {
    for (const controlName in abstractControl['controls']) {
      if (abstractControl['controls'].hasOwnProperty(controlName) && abstractControl['controls'][controlName]) {
        if (hasRequiredField(abstractControl['controls'][controlName])) {
          return true;
        }
      }
    }
  }

  return false;
};

export function objectHasAnyOwnProperties(object: {[k: string]: any}): boolean {
  return Object.keys(object).some(key => object.hasOwnProperty(key));
}
