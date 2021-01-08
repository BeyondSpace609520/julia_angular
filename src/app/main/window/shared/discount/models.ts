export interface Discount {
    id: number;
    fromDate: Date;
    untilDate: Date;
}

export interface DiscountDetail {
    nights: {
        from: number;
        until: number;
    };
    discountType: 'PricePerPersonPerNight' | 'PercOnTotal';
    discount: number;
    designation: string;
    localeId: number;
}
