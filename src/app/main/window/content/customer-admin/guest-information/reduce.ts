
import { prepareBookingGuestBody, reduceGuest } from '../customer-more-information/reduce';
import { GuestDetail, GuestType, RawGuestDetail } from './models';

export function reduceGuestDetail(g: RawGuestDetail): GuestDetail {
    return {
        ...reduceGuest(g),
        displayField: g.cbrf_displayField,
        guestId: +g.cbrf_id,
        arrivalTypeId: +(g.cbrf_arrivalMethod_id || 0),
        travelPurposeId: +(g.cbrf_visitReason_id || 0),
        type: +g.cbrf_adultNO ? GuestType.ADULT : GuestType.CHILD,
        no: +g.cbrf_adultNO || +g.cbrf_childNO,
        taxTypeId: g.cbrf_registrationTaxType_id ? +g.cbrf_registrationTaxType_id : null,
        guestTypeId: g.cbrf_guestType_id ? +g.cbrf_guestType_id : null,
        guestCardPrintingEnabled: g.guestCardPrintingEnabled === 'on',
        alreadySent: g.alreadySent === 'on',
        manuallyAdded: g.cbrf_manuallyAdded === 'on',
        doValidation: g.doValidation === 'on',
        cardNumber: g.cbrf_guestCardNumber,
        age: !isNaN(+g.c_age) ? +g.c_age : null,
        raw: g
    };
}

export function prepareBookingGuestDetailBody(g: GuestDetail) {
    return {
        ...g.raw,
        ...prepareBookingGuestBody(g),
        cbrf_visitReason_id: String(g.travelPurposeId),
        cbrf_arrivalMethod_id: String(g.arrivalTypeId)
    };
}
