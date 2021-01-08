import { Trigger } from '@/app/main/models';

export type PeriodType = 'bookingPeriod' | 'bookingCreation';

export interface RawLastMinutesItem {
    lm_fromDate: string;
    lm_id: string;
    lm_limitedDiscount: Trigger;
    lm_nights: string;
    lm_percDiscount: string;
    lm_periodType: PeriodType;
    lm_untilDate: string;
    lml_value: string;
}

export interface RawLastMinutes {
    lastMinutes: RawLastMinutesItem[];
    lastMinutesEnabled: boolean;
    overlaps: boolean;
}

export interface LastMinutesItem {
    fromDate: Date;
    id: number;
    limitedDiscount: boolean;
    nights: number;
    percDiscount: number;
    periodType: PeriodType;
    untilDate: Date;
    value: string;
}

export interface LastMinutes {
    list: LastMinutesItem[];
    enabled: boolean;
    overlaps: boolean;
}

export interface LastMinutesItemBody extends Omit<LastMinutesItem, 'id' | 'localeId'> {
    id: number | undefined;
    localeId: number;
}

export interface RawLastMinutesItemBody extends RawLastMinutesItem {
    lm_id: string;
    lml_locale_id: string;
}
