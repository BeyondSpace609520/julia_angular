import { Trigger } from '@/app/main/models';
import { FormOption } from '@/app/main/shared/form-data.service';

export type CateringSchemeType = 'ExtraChargeOverDayOfWeekPeriod' | 'ExtraChargeOverPeriod' | 'FixedAmountOnNightsStay';
export type CateringChargeType = 'PricePerPersonPerNight' | 'PercOnTotal' | null;

export interface RawChargingScheme {
    acs_id: string;
    acs_name: string;
    acs_param001: string | null;
    acs_param002: string | null;
    acs_param003: CateringChargeType;
    acs_param004: string;
    acs_param005: Trigger | string;
    cs_name: CateringSchemeType;
}

export interface RawChargingSchemeDetail extends RawChargingScheme {
    toolTips: {
        // acsl_activeChargingScheme_id: string;
        acsl_locale_id: string;
        acsl_toolTip: string;
    }[];
}

export interface ChargingSchemeGeneral {
    name: string;
    startDate: Date | null;
    endDate: Date | null;
}


export interface ChargingSchemeChildCharge {
    from: number;
    to: number;
    charge: number;
}

export interface ChargingSchemeCharges {
    adult: number;
    children: ChargingSchemeChildCharge[];
}

export interface ChargingSchemeTranslation {
    localeId: number;
    text: string;
}

export type ChargingScheme = ChargingSchemeGeneral & {
    id: number;
    type: CateringSchemeType;
};


export interface ChargingSchemeType1 extends ChargingScheme {
    charges: { [week: string]: ChargingSchemeCharges };
    forPeriod: boolean;
    chargeType: CateringChargeType;
    type: 'ExtraChargeOverDayOfWeekPeriod';
}

export interface ChargingSchemeType2 extends ChargingScheme {
    charges: ChargingSchemeCharges;
    chargeType: CateringChargeType;
    type: 'ExtraChargeOverPeriod';
}

export interface ChargingSchemeType3 extends ChargingScheme {
    charges: { [roomCategoryId: string]: ChargingSchemeCharges };
    nights: number;
    type: 'FixedAmountOnNightsStay';
}

export type AnyChargingScheme = ChargingSchemeType1 | ChargingSchemeType2 | ChargingSchemeType3;

export type ChargingSchemeDetail<T> = T & {
    translations: ChargingSchemeTranslation[];
};

export type ChargingSchemeBody<T> = Omit<T, 'id'> & {
    id?: number
};

export type RawChargingSchemeBody = Omit<RawChargingSchemeDetail, 'acs_id'> & {
    acs_id?: string;
};

export type ChargingSchemeTypeRecord = FormOption<CateringSchemeType> & { id: number; };

export interface ChargingSchemeLinkedCategory {
    id: number;
    name: string;
    checked: boolean;
}
