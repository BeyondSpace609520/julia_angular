import { stringifyDate } from '@/app/helpers/date';
import { Discount } from '../../../shared/discount/models';
import { reduceDiscount } from '../../../shared/discount/reduce';
import {
    LongStayDiscountDetail, LongStayDiscountRate,
    RawLongStayDiscount, RawLongStayDiscountDetail, RawLongStayDiscountRateBody
} from './models';

export function prepareLongStayDiscountBody(d: Discount): RawLongStayDiscount {
    return {
        lsd_id: String(d.id),
        lsd_fromDate: stringifyDate(d.fromDate, false),
        lsd_untilDate: stringifyDate(d.untilDate, false)
    };
}

export function reduceLongStayDiscountDetail(d: RawLongStayDiscountDetail): LongStayDiscountDetail {
    return {
        ...reduceDiscount(d, 'lsd'),
        rates: d.longStayDiscountRate ? d.longStayDiscountRate.map(r => ({
            id: +r.lsdr_id,
            designation: r.lsdrl_value,
            discount: +r.lsdr_value,
            discountType: r.lsdr_discountType,
            localeId: +r.lsdrl_locale_id,
            discountId: +r.lsdr_longStayDiscount_id,
            nights: {
                from: +r.lsdr_fromNights,
                until: +r.lsdr_untilNights
            }
        }) as LongStayDiscountDetail['rates'][0]) : []
    };
}

export function prepareLongStayRateBody(r: LongStayDiscountRate): RawLongStayDiscountRateBody {
    return {
        lsdr_id: String(r.id),
        lsdr_value: String(r.discount),
        lsdr_discountType: r.discountType,
        lsdrl_locale_id: String(r.localeId),
        lsdr_fromNights: String(r.nights.from),
        lsdr_untilNights: String(r.nights.until),
        lsdr_longStayDiscount_id: String(r.discountId),
        lsdrl_value: r.designation,
        lsdrl_longStayDiscountRate_id: null,
        lsdrl_id: null
    };
}
