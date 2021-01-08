import { Trigger } from '@/app/main/models';
import { SeasonPeriodConfig } from '../period-config/models';

export interface ServiceType {
    id: number;
    name: string;
    active: boolean;
}

export interface RawPricingScheme {
    ps_id: string;
    ps_name: string;
    psl_locale_id: string;
    psl_longDesc: string;
    psl_name: string;
    psl_pricingScheme_id: string;
    psl_shortDesc: string;
}

export interface PricingScheme {
  id: number;
  name: string;
  nameLang: string;
}

export interface RawPricing {
    ageGroup: null | {
        spep_fromAge: string;
        spep_toAge: string;
        spep_percDiscount: string
    }[];
    egl_value: string;
    seasonPeriodEntityEntityGroupServiceType: {
        speegst_active: Trigger;
        speegst_entityGroup_id: string;
        speegst_fromAge: string;
        speegst_price: string;
        speegst_seasonPeriodEntity_id: string;
        speegst_serviceType_id: string;
        speegst_stdDisplayPrice: Trigger
        speegst_toAge: string;
    }[];
    seasonPeriodEntityPrice: {
        spep_fromAge: string;
        spep_isStdPricePosition: Trigger;
        spep_percDiscount: string;
        spep_personsNo: string;
        spep_price: string;
        spep_seasonPeriodEntity_id: string;
        spep_serviceType_id: string;
        spep_toAge: string;
    }[];
    spe_childDiscountStartPosition: string;
    spe_childUnderXForfree: string;
    spe_cleanUpPrice: string;
    spe_id: string;
    spe_maxPersons: string;
    spe_minPersons: string;
    spe_pricingScheme_id: string;
    spe_seasonPeriodEntity_id: string;
    spe_stdPricePosition: string;
}

export interface PricingEntity {
    typeId: number;
    ages: {
        from: number;
        to: number;
        price: number;
    }[];
    seasonPeriodEntityId: number;
    adultPrice: number;
}

export interface CateringEntity extends PricingEntity {
    entityGroupId: number;
    active: boolean;
    stdDisplayPrice: boolean;
}

export interface PersonPricingEntity extends PricingEntity {
    isStdPricePosition: boolean;
    percDiscount: number;
    personsNo: number;
}



export interface Pricing {
    pricingSchemeId: number;
    cleanUpPrice: string;
    minPersons: number;
    maxPersons: number;
    stdPricePosition: number;
    stdAdultPrice: number;
    childDiscountStartPosition: number;
    childUnderXForFree: number;
    caterings?: CateringEntity[];
    prices: { [serviceId: string]: PersonPricingEntity[] };
    categoryName: string;
    seasonPeriodId: number;
    ageGroups: {
        from: number;
        to: number;
        percDiscount: number
    }[];
}


export interface RawServiceType {
    st_active: Trigger;
    st_id: string;
    st_name: string;
    st_price: string;
    st_sortOrder: string;
    stl_id: string;
    stl_locale_id: string;
    stl_name: string;
    stl_serviceType_id: string;
}

export interface RawPricingConfig {
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
    sp_id: string;
    sp_maxStay: string;
    sp_minStay: string;
    sp_untilDate: string;
    sp_useLongStayDiscount: Trigger;
    sp_useNightsMultiple: Trigger;
    spe_abFri: Trigger;
    spe_abMon: Trigger;
    spe_abSat: Trigger;
    spe_abSun: Trigger;
    spe_abThu: Trigger;
    spe_abTue: Trigger;
    spe_abWed: Trigger;
    spe_allowBooking: Trigger;
    spe_allowEnquiry: Trigger;
    spe_allowReservation: Trigger;
    spe_anFri: Trigger;
    spe_anMon: Trigger;
    spe_anSat: Trigger;
    spe_anSun: Trigger;
    spe_anThu: Trigger;
    spe_anTue: Trigger;
    spe_anWed: Trigger;
    spe_cleanUpPrice: string;
    spe_id: string;
    spe_maxStay: string;
    spe_minStay: string;
    spe_useLongStayDiscount: Trigger;
    spe_useNightsMultiple: Trigger;
}

export interface PricingConfig extends SeasonPeriodConfig {
    id: number;
    fromDate: Date;
    untilDate: Date;
    finalCleanUp?: number;
}


export interface PricingSource {
    id: number;
    type: 'category' | 'apartment';
}

export type RawPricingBody = Omit<RawPricing, 'spe_id' | 'seasonPeriodEntityEntityGroupServiceType' | 'seasonPeriodEntityPrice'> & {
    spe_id: null;
    seasonPeriodEntityEntityGroupServiceType: any[];
    seasonPeriodEntityPrice: any[];
};
