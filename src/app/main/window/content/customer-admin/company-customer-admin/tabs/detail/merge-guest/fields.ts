import { Field } from '@/app/main/window/shared/forms/builder';

import { Customer } from '@/app/main/window/shared/customer/models';

export type CustomerProp = keyof Customer;
export type Resources = 'salutations' | 'nationality' | 'documentTypes' | 'countries' | 'interests';
export type Fields = Field<CustomerProp, Resources>[];

const fields: Fields = [
    ['select', 'MW_Salutation', 'salutationId', { resource: 'salutations' }],
    ['input', 'MW_Title', 'title'],
    ['input', 'MW_FirstName', 'firstName'],
    ['input', 'MW_LastName', 'lastName'],
    ['input', 'MW_AddressLine1', 'address'],
    ['input', 'MW_AddressLinePlus', 'addressAdditional'],
    ['input', 'MW_PostCode', 'postCode'],
    ['input', 'MW_City', 'city'],
    ['input', 'MW_CityPlus', 'cityAdditional'],
    ['input', 'MW_Region', 'region'],
    ['select', 'MW_State', 'nationalityId', { resource: 'nationality' }],
    ['select', 'MW_Country', 'countryId', { resource: 'countries' }],
    ['datepicker', 'MW_BirthDate', 'birthday'],
    ['input', 'MW_BirthCity', 'birthCity'],
    ['select', 'MW_DocumentType', 'documentTypeId', { resource: 'documentTypes' }],
    ['input', 'MW_Document', 'documentNo'],
    ['input', 'MW_CountOfStays', 'noOfStays'],
    ['input', 'MW_PostBox', 'postBox'],
    ['input', 'MW_Company', 'company'],
    ['input', 'MW_TaxNumber', 'taxNo'],
    ['input', 'MW_CompanyRegNo', 'companyRegNo'],
    ['input', 'MW_Comment', 'comment'],
    ['input', 'MW_Occupation', 'occupation'],
    ['input', 'MW_OccupationBranch', 'occupationBranch'],
    ['input', 'MW_Phone', 'phoneNo'],
    ['input', 'MW_Fax', 'faxNo'],
    ['input', 'MW_Email', 'email'],
    ['input', 'MW_Internet', 'webUrl'],
    ['input', 'MW_NumberPlate', 'carRegNo'],
    ['multiselect',	'MW_SettingCharacteristics', 'characteristicsARR', { resource: 'interests' }]
];

export default fields;
