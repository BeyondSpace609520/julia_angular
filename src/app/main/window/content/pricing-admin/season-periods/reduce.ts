import dayjs from 'dayjs';

import { parseDate, stringifyDate } from '@/app/helpers/date';
import { BlockDates, RawBlockDates, RawSeasonPeriod, RawSeasonPeriodDetail, SeasonPeriod, SeasonPeriodDetail } from './models';


export function reduceSeasonPeriod(p: RawSeasonPeriod): SeasonPeriod {
    return {
        id: +p.id,
        name: p.sp_name,
        fromDate: parseDate(p.sp_fromDate),
        untilDate: parseDate(p.sp_untilDate),
    };
}

export function reduceSeasonPeriodDetail(p: RawSeasonPeriodDetail): SeasonPeriodDetail {
    return {
        id: +p.sp_id,
        name: p.sp_name,
        fromDate: parseDate(p.sp_fromDate),
        untilDate: parseDate(p.sp_untilDate),
        minStay: +p.sp_minStay,
        maxStay: +p.sp_maxStay,
        arrival: {
            monday: p.sp_anMon === 'on',
            tuesday: p.sp_anTue === 'on',
            wednesday: p.sp_anWed === 'on',
            thursday: p.sp_anThu === 'on',
            friday: p.sp_anFri === 'on',
            saturday: p.sp_anSat === 'on',
            sunday: p.sp_anSun === 'on',
        },
        departure: {
            monday: p.sp_abMon === 'on',
            tuesday: p.sp_abTue === 'on',
            wednesday: p.sp_abWed === 'on',
            thursday: p.sp_abThu === 'on',
            friday: p.sp_abFri === 'on',
            saturday: p.sp_abSat === 'on',
            sunday: p.sp_abSun === 'on',
        },
        useNightsMultiple: p.sp_useNightsMultiple === 'on',
        allowBooking: p.sp_allowBooking === 'on',
        allowEnquiry: p.sp_allowEnquiry === 'on',
        allowReservation: p.sp_allowReservation === 'on',
        active: p.ssc_active === 'on',
        minUnit: +p.ssc_minUnit,
        maxUnit: +p.ssc_maxUnit,
        chargeType: p.ssc_chargeType,
        charge: +p.ssc_charge,
        gapFillEnabled: p.sp_gapFillEnabled === 'on',
        useLongStayDiscount: null
    };
}


export function inverseReduceSeasonPeriodDetail(p: SeasonPeriodDetail): RawSeasonPeriodDetail {
    return {
        sp_id: String(p.id),
        sp_name: p.name,
        sp_fromDate: stringifyDate(p.fromDate, false),
        sp_untilDate: stringifyDate(p.untilDate, false),
        sp_minStay: String(p.minStay),
        sp_maxStay: String(p.maxStay),
        sp_anMon: p.arrival && p.arrival.monday ? 'on' : 'off',
        sp_anTue: p.arrival && p.arrival.tuesday ? 'on' : 'off',
        sp_anWed: p.arrival && p.arrival.wednesday ? 'on' : 'off',
        sp_anThu: p.arrival && p.arrival.thursday ? 'on' : 'off',
        sp_anFri: p.arrival && p.arrival.friday ? 'on' : 'off',
        sp_anSat: p.arrival && p.arrival.saturday ? 'on' : 'off',
        sp_anSun: p.arrival && p.arrival.sunday ? 'on' : 'off',
        sp_abMon: p.departure && p.departure.monday  ? 'on' : 'off',
        sp_abTue: p.departure && p.departure.tuesday  ? 'on' : 'off',
        sp_abWed: p.departure && p.departure.wednesday  ? 'on' : 'off',
        sp_abThu: p.departure && p.departure.thursday  ? 'on' : 'off',
        sp_abFri: p.departure && p.departure.friday  ? 'on' : 'off',
        sp_abSat: p.departure && p.departure.saturday  ? 'on' : 'off',
        sp_abSun: p.departure && p.departure.sunday  ? 'on' : 'off',
        sp_useNightsMultiple: p.useNightsMultiple ? 'on' : 'off',
        sp_allowBooking: p.allowBooking  ? 'on' : 'off',
        sp_allowEnquiry: p.allowEnquiry  ? 'on' : 'off',
        sp_allowReservation: p.allowReservation  ? 'on' : 'off',
        ssc_active: p.active  ? 'on' : 'off',
        ssc_minUnit: String(p.minUnit),
        ssc_maxUnit: String(p.maxUnit),
        ssc_chargeType: p.chargeType,
        ssc_charge: String(p.charge),
        sp_gapFillEnabled: p.gapFillEnabled  ? 'on' : 'off'
    };
}

export function reduceBlockDates(raw: RawBlockDates): BlockDates {
  return {
    blockArrival:
      raw.blockArrival &&
      raw.blockArrival.map((date) =>
        dayjs(parseDate(date.ba_date)).format('DD.MM.YYYY')
      ),
    blockDeparture:
      raw.blockDeparture &&
      raw.blockDeparture.map((date) =>
        dayjs(parseDate(date.bd_date)).format('DD.MM.YYYY')
      ),
  };
}

export function inverseReduceBlockDates(blockdates: BlockDates): RawBlockDates {
  return {
    blockArrival:
      blockdates.blockArrival &&
      blockdates.blockArrival.map((date: string) => ({
        ba_date: stringifyDate(date, false) || '',
      })),
    blockDeparture:
      blockdates.blockDeparture &&
      blockdates.blockDeparture.map((date: string) => ({
        bd_date: stringifyDate(date, false) || '',
      })),
  };
}
