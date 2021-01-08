import { Trigger } from '@/app/main/models';

export type RawChargeType = 'CleanUpCharge' | 'Cot' | 'Garage' | 'PetChargeLarge' | 'PetChargeSmall';

export interface RawExtraCharge {
    oc_active: Trigger;
    oc_chargeDaily: Trigger;
    oc_chargeType: RawChargeType;
    oc_id: string;
    oc_price: string;
    oc_priceIncludedAppartment: Trigger;
    oc_priceIncludedStandardRoom: Trigger;
    oc_strValue001: string;
}

export interface RawExtraChargeDetails extends RawExtraCharge {
    otherChargesLocales: {
        ocl_id: string;
        ocl_locale_id: string;
        ocl_otherCharges_id: string;
        ocl_text: string;
    }[];
}

export enum ChargeType {
    CLEAN_UP = 'clean-up',
    BABY_BED = 'baby-bed',
    PARKING = 'parking',
    LARGE_PET = 'large-pet',
    SMALl_PET = 'small-pet'
}

export interface ExtraCharge {
    id: number;
    price: number;
    active: boolean;
    name: string;
    chargeDaily: boolean;
    type: ChargeType;
    priceIncludedAppartment: boolean;
    priceIncludedStandardRoom: boolean;
    value: string;
}

export interface ExtraChargeDetails extends ExtraCharge {
    locales: ExtraChargeLocale[];
}

export interface ExtraChargeLocale {
  id: number | null;
  localeId: number;
  text: string;
  otherChargeId: number;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ExtraChargeRequestBody = Omit<ExtraChargeDetails, 'name' | 'type'>;
