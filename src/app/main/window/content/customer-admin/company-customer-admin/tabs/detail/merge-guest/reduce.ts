import { stringifyDate } from '@/app/helpers/date';
import { Customer } from '@/app/main/window/shared/customer/models';
import { MergeBody } from './models';

export function prepareCustomerBody(c1: Customer, c2: Customer): MergeBody {
    return {
        main_cid: String(c1.id),
        other_cid: String(c2.id),
        c_title: c1.title,
        c_firstName: c1.firstName,
        c_lastName: c1.lastName,
        c_eMailAddress: c1.email,
        c_webUrl: c1.webUrl,
        c_birthDay: stringifyDate(c1.birthday, false),
        c_birthCity: c1.birthCity,
        c_addressLine1: c1.address,
        c_addressLine1Plus: c1.addressAdditional,
        c_city: c1.city,
        c_cityPlus: c1.cityAdditional,
        c_region: c1.region,
        c_taxNo: c1.taxNo,
        c_country_id: String(c1.countryId),
        c_postCode: c1.postCode,
        c_salutation_id: String(c1.salutationId),
        c_nationality_id: String(c1.nationalityId),
        c_documentType_id: String(c1.documentTypeId),
        c_phoneNo: c1.phoneNo,
        c_faxNo: c1.faxNo,
        c_carRegNo: c1.carRegNo,
        c_company: c1.company,
        c_companyRegNo: c1.companyRegNo,
        c_documentNo: c1.documentNo,
        c_noOfStays: c1.noOfStays,
        c_postBox: c1.postBox,
        c_comment: c1.comment,
        c_occupation: c1.occupation,
        c_occupationBranch: c1.occupationBranch,
        bookingGuestCharacteristicsLST: c1.characteristicsARR ? c1.characteristicsARR.join(', ') : ''
    };
}
