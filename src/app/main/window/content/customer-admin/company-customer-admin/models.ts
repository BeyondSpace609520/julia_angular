import { Trigger } from '@/app/main/models';

export interface RawCustomer {
    c_accountNo: string;
    c_active: Trigger;
    c_addressLine1: string;
    c_addressLine1Plus: string | null;
    c_anonymizedAt: string | null;
    c_attachEventsPDF: Trigger;
    c_autoAnonymize: string;
    c_birthCity: string | null;
    c_birthDay: string | null;
    c_carRegNo: string | null;
    c_channelEMailAddress: string | null;
    c_city: string;
    c_cityPlus: string | null;
    c_comment: string | null;
    c_company: string;
    c_companyRegNo: string | null;
    c_country: string;
    c_country_id: string;
    c_creationDate: string;
    c_customerInterface_id: string | null;
    c_documentNo: string | null;
    c_documentType_id: string | null;
    c_eMailAddress: string;
    c_eMailAddress2: string | null;
    c_externalCustomerId: string | null;
    c_faxNo: string | null;
    c_firstName: string;
    c_guestPicture: string | null;
    c_guest_id: string;
    c_id: string;
    c_identification: string | null;
    c_ipAddress: string;
    c_lastName: string;
    c_latitude: string | null;
    c_locale_id: string;
    c_longitude: string | null;
    c_mobileNo: string | null;
    c_nationality: string | null;
    c_nationality_id: string | null;
    c_noOfStays: string | null;
    c_occupation: string | null;
    c_occupationBranch: string | null;
    c_original_c_id: string | null;
    c_phoneNo: string;
    c_phoneNo2: string | null;
    c_postBox: string | null;
    c_postCode: string;
    c_region: string | null;
    c_salutation_id: string;
    c_sendNewsLetter: Trigger;
    c_sendSafeJourneyMail: Trigger;
    c_sendSafeJourneyPlusPaymentsMail: Trigger;
    c_sendThankYouMail: Trigger;
    c_taxNo: string;
    c_title: string;
    c_webUrl: string | null;
    characteristicsARR?: number[];
    anonymizationDate?: string | null;
}

export interface RawCustomerDetail extends RawCustomer {
    c_addressLine1: string;
    c_attachEventsPDF: Trigger;
    c_autoAnonymize: string;
    c_birthDay: any;
    c_channelEMailAddress: string;
    c_city: string;
    c_comment: any;
    c_country_id: string;
    c_eMailAddress: string;
    c_eMailAddress2: any;
    c_firstName: string;
    c_identification: any;
    c_lastName: string;
    c_locale_id: string;
    c_phoneNo: string;
    c_phoneNo2: string;
    c_postCode: string;
    c_salutation_id: string;
    c_sendNewsLetter: Trigger;
    c_sendSafeJourneyMail: Trigger;
    c_sendSafeJourneyPlusPaymentsMail: Trigger;
    c_sendThankYouMail: Trigger;
    c_taxNo: string;
    c_title: string;
}

export interface RawCustomerDetailBody {
    c_sendNewsLetter: Trigger;
    c_salutation_id: string;
    c_autoAnonymize: string;
    c_sendThankYouMail: Trigger;
    c_lastName: string;
    c_sendSafeJourneyPlusPaymentsMail: Trigger;
    c_firstName: string;
    c_locale_id: string;
    c_comment: string;
    c_identification: string;
    c_id?: string;
    c_postCode: string;
    c_addressLine1: string;
    c_city: string;
    c_country_id: string | null;
    c_attachEventsPDF: Trigger;
    c_birthDay: string | null;
    c_phoneNo: string;
    c_phoneNo2: string | null;
    c_eMailAddress2: string;
    c_taxNo: string;
    c_sendSafeJourneyMail: Trigger;
    c_eMailAddress: string;
    c_accountNo: string;
    c_channelEMailAddress: string;
    c_title: string;
}

export interface CustomerDetail {
    id?: string;
    accountNo: string;
    salutation: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    email2: string;
    channelEmail: string;
    phoneNo: string;
    phoneNo2: string;
    address: string;
    postCode: string;
    city: string;
    country: string | null;
    locale: string;
    ip: string;
    creationDate: string;
    birthday: Date | null;
    identNo: string;
    taxNumber: string;
    internalInformation: string;
    sendNewsletter: boolean;
    sendSafeEmail: boolean;
    sendThankyouEmail: boolean;
    sendPaymentsEmail: boolean;
    sendRegionalEvents: boolean;
    anonymizationDate?: string | null; // instead of Date due to specific format
    allowAutoAnonymization: boolean;
}
export interface Room {
    roomId: number;
    from: Date;
    until: Date;
    nights: number;
    adults: number;
    children: number;
    largePets: number;
    smallPets: number;
    childrenAges: number[];
    adultsCharge: number;
    childCharge: number;
    cateringCharge: number;
    visitorsCharge: number;
    petCharge: number;
    cleaningCharge: number;
    discount: number;
    shortStayCharge: number;
    total: number;
}


export interface RawCustomerBooking {
    b_bookingNo: string;
    b_creationDate: string;
    b_id: string;
    eb_fromDate: string | null;
}
export interface CustomerBooking {
    id: number;
    bookingNo: string;
    creationDate: Date;
    fromDate: Date | null;
}

export interface CustomerBookingLog {
    action: 'booking_added' | 'room_added';
    date: Date;
    user: string;
}


export interface CustomerBookingLogBooking extends CustomerBookingLog {
    action: 'booking_added';
    lang: string;
    status: string;
    guestId: number;
    payment: string;
    bookingNumber: string;
    emailText: string;
    headerText: string;
    footerText: string;
    depositProposed: number;
    depositPaid: number;
    depositDueDate: Date;
    paymentReminderDate: Date;
    cancellationFee: number;
    validUntilDate: Date;
    locked: boolean;
}

export interface CustomerBookingLogRoom extends CustomerBookingLog {
    action: 'room_added';
    roomId: string;
    specialOffer: string;
    arrival: Date;
    departure: Date;
    catering: string;
    nights: number;
    persons: number;
    children: number;
    smallPets: number;
    largePets: number;
    babyBeds: number;
    parkingSpace: number;
    childrenAges: number[];
    priceAdults: number;
    priceChildren: number;
    priceCatering: number;
    visitorsTax: number;
    pricePets: number;
    cleaningCharge: number;
    totalDiscount: number;
    shortStayCharge: number;
    priceBabyBeds: number;
    priceParking: number;
    surcharges: number;
    total: number;
}
