import { parseDate } from '@/app/helpers/date';
import { RawCustomer } from '../../content/customer-admin/company-customer-admin/models';
import { Customer } from './models';

export function reduceCustomer(c: RawCustomer): Customer {
    return {
        id: c === null ? 0 : +c.c_id,
        accountNo: c === null ? '' : c.c_accountNo,
        title: c === null ? '' : c.c_title,
        firstName: c === null ? '' : c.c_firstName,
        lastName: c === null ? '' : c.c_lastName,
        email: c === null ? '' : c.c_eMailAddress,
        webUrl: c === null ? null : c.c_webUrl,
        birthday: c === null ? null : parseDate(c.c_birthDay, false),
        birthCity: c === null ? null : c.c_birthCity,
        address: c === null ? '' : c.c_addressLine1,
        addressAdditional: c === null ? null : c.c_addressLine1Plus,
        city: c === null ? '' : c.c_city,
        cityAdditional: c === null ? null : c.c_cityPlus,
        region: c === null ? null : c.c_region,
        taxNo: c === null ? '' : c.c_taxNo,
        localeId: c === null ? '' : c.c_locale_id,
        countryId: c === null ? null : (+c.c_country_id === 247 ? null : +c.c_country_id),
        postCode: c === null ? '' : c.c_postCode,
        salutationId: c === null ? 0 : +c.c_salutation_id,
        nationalityId: c === null ? null : (c.c_nationality_id ? +c.c_nationality_id : null),
        documentTypeId: c === null ? null : (c.c_documentType_id ? +c.c_documentType_id : null),
        phoneNo: c === null ? '' : c.c_phoneNo,
        phoneNoAdditional: c === null ? null : c.c_phoneNo2,
        faxNo: c === null ? '' : c.c_faxNo,
        carRegNo: c === null ? null : c.c_carRegNo,
        company: c === null ? '' : c.c_company,
        companyRegNo: c === null ? null : c.c_companyRegNo,
        documentNo: c === null ? null : c.c_documentNo,
        noOfStays: c === null ? null : c.c_noOfStays,
        postBox: c === null ? null : c.c_postBox,
        comment: c === null ? null : c.c_comment,
        occupation: c === null ? null : c.c_occupation,
        occupationBranch: c === null ? null : c.c_occupationBranch,
        characteristicsARR: c === null ? undefined : c.characteristicsARR
    };
}

