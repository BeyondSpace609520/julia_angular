import { Trigger } from '@/app/main/models';
import { FormOption } from '@/app/main/shared/form-data.service';
import { GuestDetail } from '../guest-information/models';
import { GuestRegistrationForm, TravelPurpose } from '../guest-registration/models';

export enum GuestsCategory {
    INDIVIDUAL = 'individual',
    GROUP = 'group',
    DETAIL_GROUP = 'detail-group'
}

export interface RawRegistrationTaxType {
    rtt_id: string;
    global_rtt_id: string;
    rtt_name: string;
    rtt_short: string;
    rttl_value: string;
    rtt_usedByHotel: Trigger;
    rtt_guestRegistrationProvider_id: string;
}

export interface RawRegistrationGuestType {
    gt_id: string;
    gtl_value: string;
    gt_name: string;
}

export interface RawGroupGuest {
    rgg_id: string;
    rgg_registrationForm_id: string;
    rgg_registrationTaxType_id: string;
    rgg_registrationFormCountry_externalID: string;
    rgg_count: string;
    rgg_registrationFormCountry_id: string;
}

export interface RegistrationTaxType {
    id: number;
    globalId: number;
    name: string;
    short: string;
    value: string;
    usedByHotel: boolean;
    guestRegistrationProviderId: number;
}

export interface RegistrationGuestTypes {
    main: FormOption<number>;
    adult: FormOption<number>;
    child: FormOption<number>;
    tourGuide: FormOption<number>;
    groupGuest: FormOption<number>;
}

export interface GroupGuest {
    id: number | null;
    registrationFormId: number | null;
    taxTypeId: number | null;
    registrationFormCountryExternalId: number | null;
    count: number | null;
    countryId: number | null;
}

export interface RawGroupGuestBody {
    cnt: string;
    rfc_id: string;
    rtt_id: string;
}

export interface RegistrationFormGuests {
    form?: GuestRegistrationForm;
    individual: GuestDetail[];
    group: RegistrationFormGroup;
}

export interface RegistrationFormGroup {
  leader: GuestDetail | null;
  guests: GroupGuest[];
}

export interface GroupGuestCounty extends FormOption<number> {
    countryId: number;
    postCode: { from: string; until: string; };
}

export interface RawIndividualGuestBody {
    cbrf_id: string;
    cbrf_guestType_id: string | null;
    cbrf_registrationTaxType_id: string | null;
    cbrf_guestCardNumber: string;
}

export interface RawRegFormBody {
    rg_fromDate: string;
    rg_plannedUntilDate: string;
    rg_untilDate: string | null;
    rg_id: string;
    rg_number: string;
    rfgs_id: string;
    rg_registrationType_id: string;
    rg_arrived: Trigger;
    rg_departed: Trigger;
    rg_travelPurpose: TravelPurpose | null;
    booking_id: string;
}

export interface RegFormBody {
    fromDate: Date;
    plannedUntilDate: Date;
    untilDate: Date | null;
    id: number;
    number: string | number;
    hotelRecordId: number;
    registrationTypeId: number;
    arrived: boolean;
    departed: boolean;
    bookingId: number;
    travelPurpose: TravelPurpose | null;
}

export interface IndividualGuestsData {
    main?: GuestDetail;
    all: GuestDetail[];
}
