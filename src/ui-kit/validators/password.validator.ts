import { AbstractControl, ValidatorFn } from '@angular/forms';

export const passwordMinLength = 8;

type PasswordRequirementTypes = 'lowerCaseCharacter' | 'upperCaseCharacter' | 'numericCharacter' | 'length';

export type PasswordRequirements = {
  [type in PasswordRequirementTypes]: {
    translate: string,
    parameters?: {[key: string]: string | number}
  };
};

export type PasswordErrors = {
  [type in PasswordRequirementTypes]: boolean;
};

export const requirements: PasswordRequirements = {
  lowerCaseCharacter: {
    translate: 'BackEnd_WikiLanguage.PW_RequirementLowerCaseCharacter'
  },
  upperCaseCharacter: {
    translate: 'BackEnd_WikiLanguage.PW_RequirementUpperCaseCharacter'
  },
  numericCharacter: {
    translate: 'BackEnd_WikiLanguage.PW_RequirementNumericCharacter'
  },
  length: {
    translate: 'BackEnd_WikiLanguage.PW_RequirementLength',
    parameters: {num: passwordMinLength}
  }
};

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): Partial<PasswordErrors> => {
    const errors: Partial<PasswordErrors> = {};
    if (checkMissingLowerCaseCharacters(control.value)) {
      errors.lowerCaseCharacter = true;
    }
    if (checkMissingUpperCaseCharacters(control.value)) {
      errors.upperCaseCharacter = true;
    }
    if (checkMissingNumericCharacters(control.value)) {
      errors.numericCharacter = true;
    }
    if (checkTooShort(control.value)) {
      errors.length = true;
    }
    return errors;
  };
}

function checkMissingLowerCaseCharacters(value: string): boolean {
  return !/[a-z]/.test(value);
}

function checkMissingUpperCaseCharacters(value: string): boolean {
  return !/[A-Z]/.test(value);
}

function checkMissingNumericCharacters(value: string): boolean {
  return !/[0-9]/.test(value);
}

function checkTooShort(value: string): boolean {
  return !value || value.length < passwordMinLength;
}
