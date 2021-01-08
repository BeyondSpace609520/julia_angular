import { Customer } from '../../../shared/customer/models';
import { RawCustomer } from '../../customer-admin/company-customer-admin/models';

export interface BookingGuestBody {
    c_eMailAddress: string;
    c_occupationBranch: string | null;
    c_company: string;
    c_faxNo: string | null;
    c_title: string;
    c_occupation: string | null;
    c_salutation_id: string;
    c_documentType_id: number | null;
    c_birthCity: string | null;
    c_noOfStays: string | null;
    c_companyRegNo: string | null;
    c_addressLine1Plus: string | null;
    c_cityPlus: string | null;
    c_webUrl: string | null;
    c_comment: string | null;
    c_carRegNo: string | null;
    c_nationality_id: string;
    c_postBox: string | null;
    c_lastName: string;
    c_firstName: string;
    c_region: string | null;
    characteristicsARR: string[];
    c_addressLine1: string;
    c_postCode: string;
    c_taxNo: string;
    c_city: string;
    c_birthDay: string | null;
    c_country_id: string;
    c_phoneNo: string;
    c_documentNo: string | null;
    c_phoneNo2: string | null;
}

export interface RawGuest extends RawCustomer {
    childWithLinkedBooking: string;
    minArrivalDate: string;
    bs_name: string;
}

export interface Guest extends Customer {
    linkedBooking: number;
    minArrivalDate: Date;
    bsName: string;
}
