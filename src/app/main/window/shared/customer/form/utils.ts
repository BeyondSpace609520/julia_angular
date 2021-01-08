import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { validatePostCode as validatePC, validateTravelDocument as validateTD } from '@/app/helpers/validation';

export function validatePostCode(countryIdGetter: () => number | null) {
  return (control: FormControl): ValidationErrors | null => {
    const value = +control.value;
    const countryId = countryIdGetter();

    return validatePC(value, countryId) ? null : { validatePostCode: false };
  };
}

export function validateInversePattern(nameRe: RegExp): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}