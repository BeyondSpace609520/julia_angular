import { Trigger } from '@/app/main/models';
import { SeasonPeriodConfig } from '../../../shared/period-config/models';

export type ChargeType = 'PricePerPersonPerNight' | 'PercOnTotal';

export interface RawSeasonPeriod {
    data: string;
    id: string;
    sp_abFri: Trigger;
    sp_abMon: Trigger;
    sp_abSat: Trigger;
    sp_abSun: Trigger;
    sp_abThu: Trigger;
    sp_abTue: Trigger;
    sp_abWed: Trigger;
    sp_allowBooking: Trigger;
    sp_allowEnquiry: Trigger;
    sp_allowReservation: Trigger;
    sp_anFri: Trigger;
    sp_anMon: Trigger;
    sp_anSat: Trigger;
    sp_anSun: Trigger;
    sp_anThu: Trigger;
    sp_anTue: Trigger;
    sp_anWed: Trigger;
    sp_fromDate: string;
    sp_gapFillEnabled: Trigger;
    sp_id: string;
    sp_maxStay: string;
    sp_minStay: string;
    sp_name: string;
    sp_season_id: string;
    sp_untilDate: string;
    sp_useDiscounts: string;
    sp_useLongStayDiscount: Trigger;
    sp_useNightsMultiple: Trigger;
}

export interface SeasonPeriod {
    id: number;
    name: string;
    fromDate: Date;
    untilDate: Date;
}

export interface RawSeasonPeriodDetail {
    sp_abFri: Trigger;
    sp_abMon: Trigger;
    sp_abSat: Trigger;
    sp_abSun: Trigger;
    sp_abThu: Trigger;
    sp_abTue: Trigger;
    sp_abWed: Trigger;
    sp_allowBooking: Trigger;
    sp_allowEnquiry: Trigger;
    sp_allowReservation: Trigger;
    sp_anFri: Trigger;
    sp_anMon: Trigger;
    sp_anSat: Trigger;
    sp_anSun: Trigger;
    sp_anThu: Trigger;
    sp_anTue: Trigger;
    sp_anWed: Trigger;
    sp_fromDate: string;
    sp_gapFillEnabled: Trigger;
    sp_id: string;
    sp_maxStay: string;
    sp_minStay: string;
    sp_name: string;
    // sp_season_id: string;
    sp_untilDate: string;
    // sp_useDiscounts: string;
    // sp_useLongStayDiscount: Trigger;
    sp_useNightsMultiple: Trigger;
    ssc_active: Trigger;
    ssc_charge: string;
    ssc_chargeType: ChargeType;
    // ssc_id: string;
    ssc_maxUnit: string;
    ssc_minUnit: string;
    // ssc_seasonPeriod_id: string;
}

export interface SeasonPeriodDetail extends SeasonPeriodConfig {
    id: number;
    name: string;
    fromDate: Date;
    untilDate: Date;
    active: boolean;
    minUnit: number;
    maxUnit: number;
    chargeType: ChargeType;
    charge: number;
    gapFillEnabled: boolean;
}

export interface RawBlockDates {
  blockArrival: { ba_date: string }[];
  blockDeparture: { bd_date: string }[];
}

export interface BlockDates {
  blockArrival: string[];
  blockDeparture: string[];
}
