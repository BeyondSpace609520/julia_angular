import { Trigger } from '@/app/main/models';
import { WeekDay } from '../../../shared/periods/models';

export interface RawSpecialOffer {
    so_id: string;
    so_specialOfferCategory_id: null | string;
    so_serviceType_id: string;
    so_sortOrder: string;
    so_active: Trigger;
    so_img001: string;
    so_fromDate: string | null;
    so_untilDate: string | null;
    so_minPersons: string;
    so_maxPersons: string;
    so_nightsStay: string;
    so_anMon: Trigger;
    so_anTue: Trigger;
    so_anWed: Trigger;
    so_anThu: Trigger;
    so_anFri: Trigger;
    so_anSat: Trigger;
    so_anSun: Trigger;
    so_bookableFromDate: string | null;
    so_bookableUntilDate: string | null;
    so_priceConfirmationStatus: string;
    so_priceConfirmationDate: string;
    so_priceConfirmationComments: null | string;
    so_individualCatering: Trigger;
    so_highlighted: Trigger;
    sol_title: string;
}

export interface RawSpecialOfferDetails extends RawSpecialOffer {
    sol_id: string;
    sol_specialOffer_id: string;
    sol_locale_id: string;
    sol_shortDesc: string;
    sol_shortDescText: string;
    sol_longDesc: string;
    sol_longDescText: string;
}

export interface  SpecialOffer {
    id: number;
    title: string;
    fromDate: Date | null;
    untilDate: Date | null;
    bookableFromDate: Date | null;
    bookableUntilDate: Date | null;
    active: boolean;
    minPersons: number;
    maxPersons: number;
    nightsStay: number;
    days: {[key in WeekDay]: boolean};
    individualCatering: boolean;
}

export interface  SpecialOfferDetails extends SpecialOffer {
    shortDesc: string;
    longDesc: string;
    sortOrder: string;
    serviceTypeId: number;
    categoryId: number | null;
    highlighted: boolean;
    image: string;
}

export interface RawSpecialOfferPeriod {
    sop_id: string;
    sop_isChild: Trigger;
    sop_fromDate: string;
    sop_untilDate: string;
}

export interface RawSpecialOfferPeriodPricing {
    ageGroup: {
        sopeg_fromAge: string;
        sopeg_toAge: string;
    }[];
    entityGroup: {
        sopeg_entityGroup_id: string;
    }[];
    ageGroupPrice: {
        sopeg_entityGroup_id: string;
        sopeg_fromAge: string;
        sopeg_toAge: string;
        sopeg_price: string;
        sopeg_roomCharge: string;
        sopeg_cateringQuota: string;
        sopeg: string;
    }[];
}

export type RawSpecialOfferPricing = RawSpecialOfferPeriodPricing & RawSpecialOffer & {
    specialOfferPeriod: RawSpecialOfferPeriod[];
};

export interface SpecialOfferPeriod {
    id: number;
    isChild: boolean;
    fromDate: Date;
    untilDate: Date;
}

export interface SpecialOfferPeriodPricing {
    ageGroups: {
        from: number;
        to: number;
    }[];
    prices: SpecialOfferPeriodPrice[];
}

export interface SpecialOfferPeriodPrice {
  categoryId: number;
  cateringQuota: number;
  adult: {
    price: number;
    charge: number;
  };
  ages: {
    price: number;
    charge: number;
  }[];
}

export interface SpecialOfferPricing extends SpecialOfferPeriodPricing {
  offer: SpecialOffer;
  periods: SpecialOfferPeriod[];
}

export interface RawLocalRoomCategory {
  eg_name: string;
  eg_sortOrder: string;
  egl_id: string;
  egl_value: string;
  id: string;
}

export interface LocalRoomCategory {
  id: number;
  name: string;
  sortOrder: string;
  localeId: number;
  label: string;
}
