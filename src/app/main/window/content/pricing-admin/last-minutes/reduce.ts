import { parseDate, stringifyDate } from '@/app/helpers/date';
import { LastMinutes, LastMinutesItem, LastMinutesItemBody, RawLastMinutes, RawLastMinutesItemBody } from './models';

export function reduceLastMinutes(l: RawLastMinutes): LastMinutes {
    return {
        list: l.lastMinutes.map(item => ({
            id: +item.lm_id,
            fromDate: parseDate(item.lm_fromDate),
            untilDate: parseDate(item.lm_untilDate),
            limitedDiscount: item.lm_limitedDiscount === 'on',
            nights: +item.lm_nights,
            percDiscount: +item.lm_percDiscount,
            periodType: item.lm_periodType,
            value: item.lml_value
        } as LastMinutesItem)),
        enabled: l.lastMinutesEnabled,
        overlaps: l.overlaps
    };
}

export function prepareLastMinutesBody(l: LastMinutesItemBody): RawLastMinutesItemBody {
    return {
        lm_id: String(l.id || 0),
        lm_fromDate: stringifyDate(l.fromDate, false),
        lm_untilDate: stringifyDate(l.untilDate, false),
        lm_nights: String(l.nights),
        lm_periodType: l.periodType,
        lm_limitedDiscount: l.limitedDiscount ? 'on' : 'off',
        lm_percDiscount: String(l.percDiscount),
        lml_locale_id: String(l.localeId),
        lml_value: l.value
    };
}
