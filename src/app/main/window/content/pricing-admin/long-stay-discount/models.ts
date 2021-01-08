import { Discount, DiscountDetail } from '../../../shared/discount/models';

export interface RawLongStayDiscount {
    lsd_id: string;
    lsd_fromDate: string;
    lsd_untilDate: string;
}
export interface RawLongStayDiscountDetail extends RawLongStayDiscount {
    longStayDiscountRate: {
        lsdr_discountType: string;
        lsdr_fromNights: string;
        lsdr_id: string;
        lsdr_longStayDiscount_id: string;
        lsdr_untilNights: string;
        lsdr_value: string;
        lsdrl_id: string;
        lsdrl_locale_id: string;
        lsdrl_longStayDiscountRate_id: string;
        lsdrl_value: string;
    }[];
}


export interface LongStayDiscountDetail extends Discount {
    rates: LongStayDiscountRate[];
}

export interface LongStayDiscountRate extends DiscountDetail {
    id: number;
    discountId: number;
    localeId: number;
}

// tslint:disable-next-line: max-line-length
export type RawLongStayDiscountRateBody = Omit<RawLongStayDiscountDetail['longStayDiscountRate'][0], 'lsdrl_longStayDiscountRate_id' | 'lsdrl_id'> & {
    lsdrl_longStayDiscountRate_id: null,
    lsdrl_id: null
};

