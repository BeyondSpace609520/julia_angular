import { stringifyDate } from '@/app/helpers/date';
import { GuestDetail } from '../guest-information/models';
import {
  GroupGuest, RawGroupGuest, RawGroupGuestBody, RawIndividualGuestBody,
  RawRegFormBody, RawRegistrationGuestType, RawRegistrationTaxType,
  RegFormBody, RegistrationGuestTypes, RegistrationTaxType
} from './models';

export function reduceRegGuestType(list: RawRegistrationGuestType[]): RegistrationGuestTypes {
  const findType = (name: string) => {
    const type = list.find(item => item.gt_name === name);
    if (!type) { throw new Error(`RegistrationGuestType for name ${name} not found`); }
    return {
      value: +type.gt_id,
      name: type.gtl_value,
    };
  };
  return {
    main: findType('Hauptgemeldeter Gast'),
    adult: findType('Mitreisende Person'),
    child: findType('Kind'),
    tourGuide: findType('Reiseleiter'),
    groupGuest: findType('Reisegruppe Gast')
  };
}

export function reduceTaxType(t: RawRegistrationTaxType): RegistrationTaxType {
  return {
    id: +t.rtt_id,
    globalId: +t.global_rtt_id,
    name: t.rtt_name,
    short: t.rtt_short,
    usedByHotel: t.rtt_usedByHotel === 'on',
    value: t.rttl_value,
    guestRegistrationProviderId: +t.rtt_guestRegistrationProvider_id
  };
}

export function reduceGroupGuest(g: RawGroupGuest): GroupGuest {
  return {
    id: +g.rgg_id,
    count: g.rgg_count ? +g.rgg_count : null,
    registrationFormCountryExternalId: +g.rgg_registrationFormCountry_externalID,
    countryId: +g.rgg_registrationFormCountry_id,
    registrationFormId: +g.rgg_registrationForm_id,
    taxTypeId: +g.rgg_registrationTaxType_id
  };
}

export function prepareGroupGuestBody(g: GroupGuest): RawGroupGuestBody {
  return {
    cnt: g.count ? g.count.toString() : '',
    rfc_id: g.countryId ? g.countryId.toString() : '',
    rtt_id:  g.taxTypeId ? g.taxTypeId.toString() : '',
  };
}

export function prepareIndividualGuestBody(b: GuestDetail): RawIndividualGuestBody {
  return {
    cbrf_id: String(b.guestId),
    cbrf_guestCardNumber: b.cardNumber || '',
    cbrf_guestType_id: b.guestTypeId ? String(b.guestTypeId) : null,
    cbrf_registrationTaxType_id: b.taxTypeId ? String(b.taxTypeId) : null
  };
}

export function prepareRegFormBody(f: RegFormBody): RawRegFormBody {
  return {
    rg_id: String(f.id),
    booking_id: String(f.bookingId),
    rfgs_id: String(f.hotelRecordId),
    rg_arrived: f.arrived ? 'on' : 'off',
    rg_departed: f.departed ? 'on' : 'off',
    rg_number: String(f.number),
    rg_registrationType_id: String(f.registrationTypeId),
    rg_fromDate: stringifyDate(f.fromDate, false),
    rg_untilDate: stringifyDate(f.untilDate, false),
    rg_plannedUntilDate: stringifyDate(f.plannedUntilDate, false),
    rg_travelPurpose: f.travelPurpose
  };
}
