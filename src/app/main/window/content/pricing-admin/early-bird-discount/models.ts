import { Discount, DiscountDetail } from '../../../shared/discount/models';

export interface RawEarlyBirdDiscount {
    ebd_id: string;
    ebd_fromDate: string;
    ebd_untilDate: string;
}

export interface RawEarlyBirdDiscountDetail extends RawEarlyBirdDiscount {
    ebd_daysBeforeArrival: string;
    ebd_discountType: string;
    ebd_fixedDate: null | string;
    ebd_nightsFrom: string;
    ebd_nightsUntil: string;
    ebd_type: DiscountDateType;
    ebd_value: null | string;
    ebdl_value: string;
    ebdl_locale_id: string;
}

export enum DiscountDateType {
    DAYS = 'xdays',
    FIXED = 'fixeddate'
}

export interface EarlyBirdDiscountDetail extends Discount, DiscountDetail {
    daysBeforeArrival: number;
    fixedDate: null | Date;
    dateType: DiscountDateType;
}
