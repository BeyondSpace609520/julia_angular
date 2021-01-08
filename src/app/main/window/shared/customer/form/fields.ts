import { ValidatorFn, Validators } from '@angular/forms';

import { subYears } from 'date-fns';

import { Guest } from '../../../content/customer-admin/customer-more-information/models';
import { Field } from '../../forms/builder';
import { validateInversePattern, validatePostCode } from './utils';

export type Resources = 'salutations' | 'nationality' | 'countries' | 'documentTypes' | 'interests' | 'arrivalTypes' | 'travelPurposes';
export type Fields<T extends Guest> = Field<FieldKeys<T>, Resources>[];
export type FieldKeys<T extends Guest> = keyof T;

export const getColumnsFields = <T extends Guest>(
  onChooseCustomer: () => void,
  guest: Guest,
  tooltipTemplate: any
): Fields<T>[] => {
  return [
    [
      ['select', 'MW_Salutation', 'salutationId', {resource: 'salutations'}],
      ['input', 'MW_Title', 'title'],
      ['input', 'MW_FirstName', 'firstName'],
      ['input', 'MW_LastName', 'lastName', {onClickLabel: onChooseCustomer}],
      ['input', 'MW_AddressLine1', 'address'],
      ['input', 'MW_AddressLinePlus', 'addressAdditional'],
      ['input', 'MW_PostCode', 'postCode'],
      ['auto-city-input', 'MW_City', 'city', {
        dependencies: [
          {key: 'countryId', field: 'countryId'},
          {key: 'postCode', field: 'postCode'},
        ]
      }],
      ['input', 'MW_CityPlus', 'cityAdditional'],
      ['input', 'MW_Region', 'region'],
      ['select', 'MW_State', 'nationalityId', {resource: 'nationality'}],
      ['select', 'MW_Country', 'countryId', {
        resource: 'countries'
      }]
    ],
    [
      ['datepicker', 'MW_BirthDate', 'birthday', {
        disabled: Boolean(guest.linkedBooking),
        tooltip: guest.linkedBooking ? tooltipTemplate : '',
        minDate: subYears(new Date(), 100),
      }],
      ['input', 'MW_BirthCity', 'birthCity'],
      ['select', 'MW_DocumentType', 'documentTypeId', {resource: 'documentTypes'}],
      ['input', 'MW_Document', 'documentNo'],
      ['input', 'MW_CountOfStays', 'noOfStays'],
      ['input', 'MW_PostBox', 'postBox'],
      ['input', 'MW_Company', 'company'],
      ['input', 'MW_TaxNumber', 'taxNo'],
      ['input', 'MW_CompanyRegNo', 'companyRegNo'],
      ['input', 'MW_Comment', 'comment'],
      ['input', 'MW_Occupation', 'occupation']
    ],
    [
      ['input', 'MW_OccupationBranch', 'occupationBranch'],
      ['input', 'MW_Phone', 'phoneNo'],
      ['input', 'MW_PhoneTwo', 'phoneNoAdditional'],
      ['input', 'MW_Fax', 'faxNo'],
      ['input', 'MW_Email', 'email'],
      ['input', 'MW_Internet', 'webUrl'],
      ['input', 'MW_NumberPlate', 'carRegNo'],
      ['multiselect', 'MW_SettingCharacteristics', 'characteristicsARR', {resource: 'interests'}]
    ]
  ];
};

export const setFieldsValidators = <T extends Guest>(
  fields: Fields<T>[],
  countryIdGetter: () => number | null,
  fieldsRequired: FieldKeys<T>[]
): void => {
  fieldsRequired.push('countryId');
  fields.map(column => {
    return column.map(field => {
      const isRequired = fieldsRequired.includes(field[2]);
      if (isRequired) {
        if (!field[3]) {
          field[3] = {};
        }
        field[3].required = true;
        field[3].validators = getValidators(field[2], countryIdGetter);
      } else if (field[3]) {
        field[3].required = false;
        field[3].validators = undefined;
      }
      return field;
    });
  });
};

function getValidators<T extends Guest>(
  fieldName: keyof T,
  countryIdGetter: () => number | null,
): ValidatorFn[] {
  const strValidators = [Validators.required, Validators.minLength(2)];

  switch (fieldName) {
    case 'birthday':
    case 'countryId':
      return [Validators.required];
    case 'firstName':
    case 'lastName':
    case 'city':
      return strValidators;
    case 'postCode':
      return [validatePostCode(countryIdGetter), ...strValidators];
    case 'documentNo':
      return strValidators;
    case 'nationalityId':
      return [validateInversePattern(/0/), Validators.required];
    default:
      return [];
  }
}
