import { Trigger } from '@/app/main/models';

export type EnquiryPoolTabId = 'statistics' | 'ebEnquiryPool' | 'desklineEnquiryPool' | 'desklineEnquiryPoolActivation';

export interface RawEnquiry {
    actualArrival: string | null;
    actualDeparture: string | null;
    altCategory: string;
    arrivalTooltip: string;
    b_bookingStatus_id: string | null;
    bs_name: string | null;
    bs_name0: string | null;
    bs_name1: string | null;
    bs_name2: string | null;
    catering: string;
    cl_name: string;
    currentMaxId: string | null;
    departureTooltip: string;
    entity_id: string | null;
    ep_DOBs: string | null;
    ep_addressLine1: string;
    ep_airbnbCcId: string | null;
    ep_airbnbConfirmationCode: string | null;
    ep_altEntityGroup_id: string;
    ep_arrival: string | null;
    ep_arrival_UK: string;
    ep_arrival_display: string;
    ep_booking_id: string | null;
    ep_booking_id0: string | null;
    ep_booking_id1: string | null;
    ep_booking_id2: string | null;
    ep_cancelDate: string;
    ep_childAge1: string | null;
    ep_childAge2: string | null;
    ep_childAge3: string | null;
    ep_childAge4: string | null;
    ep_childAge5: string | null;
    ep_childAge6: string | null;
    ep_childAges: string;
    ep_childBDay1: string | null;
    ep_childBDay2: string | null;
    ep_childBDay3: string | null;
    ep_childBDay4: string | null;
    ep_childBDay5: string | null;
    ep_childBDay6: string | null;
    ep_city: string;
    ep_comment: string;
    ep_country_id: string;
    ep_customer_id: string;
    ep_deleted: string | null;
    ep_departure: string;
    ep_email: string;
    ep_enquiryPoolExt_id: string | null;
    ep_entityGroup_id: string;
    ep_firstname: string;
    ep_id: string;
    ep_inputDate: string | null;
    ep_inputDate_SORT: string;
    ep_ip: string;
    ep_locale_id: string;
    ep_name: string;
    ep_name_SORT: string;
    ep_nights: string;
    ep_nights_SORT: string;
    ep_noOfChildren: string;
    ep_noOfPersons: string;
    ep_noOfPersons_SORT: string;
    ep_phone: string;
    ep_postCode: string;
    ep_price: string;
    ep_price_SORT: string | null;
    ep_salutation_id: string;
    ep_serviceTypeName: string | null;
    ep_serviceType_id: string;
    ep_source: string;
    ep_source_SORT: string;
    ep_status: string;
    ep_statusSortId: string;
    ep_status_SORT: string;
    ep_title: string;
    epe_rangeFromDate: string | null;
    epe_rangeFromDate_UK: string | null;
    epe_rangeUntilDate: string | null;
    epe_rangeUntilDate_UK: string | null;
    isAirbnb: Trigger;
    language: string;
    mainCategory: string;
    minFromDate: string | null;
    minFromDate0: string | null;
    minFromDate1: string | null;
    minFromDate2: string | null;
    rangeEnquiry: string;
    tooltip_text: string | null;
    _explicitType: string;
}

export interface Enquiry {
    id: number;
    status: 'automatic' | 'manual' | 'openEnquiry' | 'cancelled';
    source: string;
    name: string;
    createdDate: Date | null;
    arrival: Date | null;
    start: Date | null;
    end: Date | null;
    nights: number;
    adults: number;
    children: number;
    age: number;
    price: string;
    comment: string;
    bookingIds: [number | null, number | null, number | null, number | null];
    minFromDates: [Date | null, Date | null, Date | null, Date | null];
    names: [string | null, string | null, string | null, string | null];
    isAirbnb: boolean;
    locale: string;
    raw: RawEnquiry;
    bookingStatusId: number | null;
    companyInfo: string;
}

export interface RawFeratelEnquiry extends RawEnquiry {
  target_booking_id: string;
  target_arrivalDate: string;
}

export interface FeratelEnquiry extends Enquiry {
  targetBookingId: number;
  targetArrival: Date | null;
}

export interface GetRequestParams {
    fromDate: string;
    untilDate: string;
    autoCHK: Trigger;
    manualCHK: Trigger;
    openCHK: Trigger;
    cancelledCHK: Trigger;
    dateFilterOption: '' | 'inputDate' | 'arrivalDate';
}

export enum BookingStatus {
  Enquiry = 1,
  Reservation = 2,
  Booking = 3
}
