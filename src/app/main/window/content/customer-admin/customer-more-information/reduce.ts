import { parseDate, stringifyDate } from '@/app/helpers/date';
import { Customer } from '../../../shared/customer/models';
import { reduceCustomer } from '../../../shared/customer/reduce';
import { BookingGuestBody, Guest, RawGuest } from './models';

export function prepareBookingGuestBody(c: Customer): BookingGuestBody {
    return {
        c_title: c.title,
        c_firstName: c.firstName,
        c_lastName: c.lastName,
        c_eMailAddress: c.email,
        c_webUrl: c.webUrl,
        c_birthDay: stringifyDate(c.birthday, false),
        c_birthCity: c.birthCity,
        c_addressLine1: c.address,
        c_addressLine1Plus: c.addressAdditional,
        c_city: c.city,
        c_cityPlus: c.cityAdditional,
        c_region: c.region,
        c_taxNo: c.taxNo,
        c_country_id: String(c.countryId),
        c_postCode: c.postCode,
        c_salutation_id: String(c.salutationId),
        c_nationality_id: String(c.nationalityId),
        c_documentType_id: c.documentTypeId,
        c_phoneNo: c.phoneNo,
        c_phoneNo2: c.phoneNoAdditional,
        c_faxNo: c.faxNo,
        c_carRegNo: c.carRegNo,
        c_company: c.company,
        c_companyRegNo: c.companyRegNo,
        c_documentNo: c.documentNo,
        c_noOfStays: c.noOfStays,
        c_postBox: c.postBox,
        c_comment: c.comment,
        c_occupation: c.occupation,
        c_occupationBranch: c.occupationBranch,
        characteristicsARR: c.characteristicsARR ? c.characteristicsARR.map(v => String(v)) : []
    };
}

export function reduceGuest(g: RawGuest): Guest {
    return {
        ...reduceCustomer(g),
        linkedBooking: +g.childWithLinkedBooking,
        minArrivalDate: parseDate(g.minArrivalDate, false) || new Date(),
        bsName: g.bs_name
    };
}
