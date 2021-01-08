import { parseDate, stringifyDate } from '@/app/helpers/date';
import { Providers } from '../create-registration-form/consts';
import {
  BasicGuestRegistrationForm, GuestRegistrationForm, GuestRegistrationFormDetail, GuestRegistrationItem,
  HotelRegistrationRecord, RawBasicGuestRegistrationForm, RawGuestRegistrationForm,
  RawGuestRegistrationFormDetail, RawGuestRegistrationItem, RawHotelRegistrationRecord, Status, ViewMode
} from './models';

export function reduceHotel(h: RawHotelRegistrationRecord): HotelRegistrationRecord {
  return {
    id: +h.rfgs_id,
    advanceBookingPossible: h.prepareFormPossible === 'on',
    allowTravelGroup: h.grp_id
      ? ![Providers.CARDXPERTS, Providers.CAPCORN, Providers.GEIOS].includes(
          +h.grp_id
        )
      : true,
    alternativeProviderLink: h.rfgs_altLink,
    businessIndicator: h.rfgs_businessIndicator,
    canProviderPrintGuestCard:
      h.rfgs_clientCode !== '' ||
      h.rfgs_guestCardSeparate === 'on' ||
      +h.grp_id !== Providers.WILKEN,
    clientCode: h.rfgs_clientCode,
    communityNumber: h.rfgs_communityNumber,
    code: h.rfgs_code,
    companyCode: h.companyCode,
    desklineEditionV3: +h.cf_desklineEdition === 3,
    emailToFeratel: h.rfgs_emailToFeratel === 'on',
    guestCardPrintLink: h.rfgs_guestCardPrintLink,
    guestCardSeparate: h.rfgs_guestCardSeparate === 'on',
    guestRegistrationProviderId: +h.grp_id,
    hasGuestCard:
      (+h.grp_id === Providers.FERATEL || +h.grp_id === Providers.FERATELCH) &&
      ((h.cf_desklineEdition === '3' && h.rfgs_guestCardPrintLink
        ? h.rfgs_guestCardPrintLink.length > 5
        : false) ||
        (h.cf_desklineEdition !== '3' && h.rfgs_clientCode
          ? h.rfgs_clientCode.length > 0
          : false)),
    mcNumber: h.rfgs_mcNumber,
    name: h.rfgs_name,
    needGuestCard: +h.grp_id === Providers.THALER,
    strictValidation: needsStrictValidation(+h.grp_id),
    password: h.rfgs_password,
    printLink: h.grp_printLink === 'on',
    raw: h,
    sortOrder: +h.rfgs_sortOrder,
    username: h.rfgs_username,
  };
}

export function reduceBasicRegistrationForm(r: RawBasicGuestRegistrationForm): BasicGuestRegistrationForm {
  return {
    id: +r.rg_id,
    bookingId: +r.rg_booking_id,
    errorMessage: r.rg_errorMsgAtRetry,
    restoreInformation: r.rg_restoreInformation,
    number: r.rg_number,
    arrived: r.rg_arrived === 'on',
    departed: r.rg_departed === 'on',
    fromDate: new Date(),
    plannedUntilDate: new Date(),
    untilDate: null,
    numberInternal: r.rg_numberInternal,
    travelPurpose: r.rg_travelPurpose
  };
}

export function reduceRegistrationForm(r: RawGuestRegistrationForm): GuestRegistrationForm {
  return {
    ...reduceBasicRegistrationForm(r),
    fromDate: parseDate(r.rg_fromDate),
    untilDate: parseDate(r.rg_untilDate),
    plannedUntilDate: parseDate(r.rg_plannedUntilDate),
    registrationTypeId: +r.rg_registrationType_id,
    strictValidation: r.rfgs_guestRegistrationProvider_id
      ? [
          Providers.SWTECH,
          Providers.COMMUNITY,
          Providers.NEUHOLD,
          Providers.TIBIDONO,
        ].includes(+r.rfgs_guestRegistrationProvider_id)
      : undefined,
    needGuestCard:
      +r.rfgs_guestRegistrationProvider_id === Providers.THALER,
    canForceDeparture: canForceDeparture(
      +r.rfgs_guestRegistrationProvider_id,
      r.departed_rg_id
    ),
    detailGroupRequired:
      +r.rfgs_guestRegistrationProvider_id === Providers.CARDXPERTS,
    providerAvs: +r.rfgs_guestRegistrationProvider_id === Providers.AVS,
    guestRegistrationProviderId: +r.rfgs_guestRegistrationProvider_id,
    guestRegistrationSettingsId: +r.rg_registrationFormGeneralSettings_id,
  };
}


export function reduceRegistrationFormDetail(r: RawGuestRegistrationFormDetail): GuestRegistrationFormDetail {
  return {
    ...reduceBasicRegistrationForm(r),
    fromDate: parseDate(r.rg_fromDateUK, false),
    plannedUntilDate: parseDate(r.rg_plannedUntilDateUK, false),
    untilDate: parseDate(r.rg_untilDateUK, false),
    lastName: r.c_lastName,
    customerAddress: r.customerAddress,
    customerNationality: r.customerNationality,
    customerCountry: r.customerCountry,
    adultNO: r.cbrf_adultNO ? +r.cbrf_adultNO : null,
    childNO: r.cbrf_childNO ? +r.cbrf_childNO : null,
    value: r.rtl_value,
    cancelled: r.cancelled,
    regformPrintEnabled: r.regformPrintEnabled === 'on',
    guestcardPrintEnabled: r.guestcardPrintEnabled === 'on',
    noOfPersons: +r.rg_noOfPersons,
    type: r.rtl_value
  };
}

export function reduceGuestRegistrationItem(f: RawGuestRegistrationItem): GuestRegistrationItem {
  return {
    bookingId: +f.b_id,
    arrival: parseDate(f.minArrivalUK, false),
    name: f.bs_name,
    lastName: f.c_lastName,
    rooms: +f.roomCount,
    persons: f.numPersons,
    nights: +f.nights,
    checkout: f.numDeRegistered,
    registered: f.numRegistered,
    completeGuestData: f.completeGuestData === 'on',
    screwedRgExists: f.screwedRgExists === 'on',
    regForms: f.regForms ? f.regForms.map(reduceRegistrationForm) : [],
    canCreateRegForm: f.newRegform === 'on'
  };
}

// tslint:disable-next-line: max-line-length
export function prepareBookingListBody(name: string, hotelId: HotelRegistrationRecord['id'], fromDate: Date, untilDate: Date, status: Status) {
  return {
    fromDate: stringifyDate(fromDate, false),
    untilDate: stringifyDate(untilDate, false),
    statusFilter: status,
    rfgs_id: String(hotelId),
    nameFilter: name
  };
}

// tslint:disable-next-line: max-line-length
export function prepareRegistrationFormsBody(name: string, hotelId: HotelRegistrationRecord['id'], fromDate: Date, untilDate: Date, mode: ViewMode, from: number, until: number, type: number) {
  return {
    rfgs_id: String(hotelId),
    fromDate: stringifyDate(fromDate, false),
    untilDate: stringifyDate(untilDate, false),
    nameFilter: name,
    filterNumberFrom: from,
    filterNumberUntil: until,
    mode,
    filterType: type
  };
}

// https://trello.com/c/Wlb5gpBd/194-customer-admin-guest-registration-guest-information-screen-field-validation
function needsStrictValidation(grpId: number): boolean {
  return [
    Providers.SWTECH,
    Providers.COMMUNITY,
    Providers.NEUHOLD,
    Providers.TIBIDONO,
  ].includes(grpId);
}

export function canForceDeparture(registrationProviderId: number, departedRGId: any): boolean {
  return (
    [Providers.FERATEL, Providers.FERATELCH, Providers.WILKEN].includes(registrationProviderId) &&
    departedRGId !== null
  );
}
