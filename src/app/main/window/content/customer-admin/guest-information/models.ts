import { Trigger } from '@/app/main/models';
import { Guest, RawGuest } from '../customer-more-information/models';

export enum GuestType {
    ADULT = 'adult',
    CHILD = 'child'
}

export interface RawGuestDetail extends RawGuest {
    alreadySent: Trigger;
    bs_name: string;
    c_age: string;
    c_birthDayNice: string | null;
    cancelled: Trigger;
    cbrf_adultNO: string;
    cbrf_arrivalMethod_id: string | null;
    cbrf_avsPersonId: string | null;
    cbrf_booking_id: string;
    cbrf_childNO: string;
    cbrf_customer_id: string;
    cbrf_displayField: string;
    cbrf_displayFieldOrig: string;
    cbrf_guestCardNumber: string | null;
    cbrf_guestCardPrintingConsent: Trigger;
    cbrf_guestType_id: string | null;
    cbrf_id: string;
    cbrf_manuallyAdded: Trigger;
    cbrf_registrationForm_id: string | null;
    cbrf_registrationTaxType_id: string | null;
    cbrf_visitReason_id: string | null;
    doValidation: Trigger;
    guestCardPrintingEnabled: string;
}


export interface GuestDetail extends Guest {
    displayField: string;
    guestId: number;
    arrivalTypeId: number;
    travelPurposeId: number;
    type: GuestType;
    no: number;
    taxTypeId: number | null;
    guestTypeId: number | null;
    guestCardPrintingEnabled: boolean;
    alreadySent: boolean;
    manuallyAdded: boolean;
    doValidation: boolean;
    cardNumber: string | null;
    age: number | null;
    raw: RawGuestDetail;
}
