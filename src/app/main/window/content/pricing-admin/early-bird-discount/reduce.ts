import { parseDate, stringifyDate } from '@/app/helpers/date';
import { reduceDiscount } from '../../../shared/discount/reduce';
import { EarlyBirdDiscountDetail, RawEarlyBirdDiscountDetail } from './models';

export function reduceEarlyBirdDiscountDetail(d: RawEarlyBirdDiscountDetail): EarlyBirdDiscountDetail {
    return {
        ...reduceDiscount(d, 'ebd'),
        daysBeforeArrival: +d.ebd_daysBeforeArrival,
        designation: d.ebdl_value,
        discount: d.ebd_value ? +d.ebd_value : 0,
        discountType: d.ebd_discountType as any,
        fixedDate: parseDate(d.ebd_fixedDate),
        dateType: d.ebd_type,
        nights: {
            from: +d.ebd_nightsFrom,
            until: +d.ebd_nightsUntil
        },
        localeId: +d.ebdl_locale_id
    };
}

export function prepareEarlyBirdDiscountBody(d: EarlyBirdDiscountDetail): RawEarlyBirdDiscountDetail {
    return {
        ebd_id: d.id === null ? '0' : String(d.id),
        ebd_value: String(d.discount),
        ebd_daysBeforeArrival: String(d.daysBeforeArrival),
        ebd_discountType: d.discountType,
        ebd_fixedDate: stringifyDate(d.fixedDate, false),
        ebd_fromDate: stringifyDate(d.fromDate, false),
        ebd_untilDate: stringifyDate(d.untilDate, false),
        ebd_nightsFrom: d.nights && String(d.nights.from),
        ebd_nightsUntil: d.nights && String(d.nights.until),
        ebd_type: d.dateType,
        ebdl_value: d.designation,
        ebdl_locale_id: String(d.localeId)
    };
}
