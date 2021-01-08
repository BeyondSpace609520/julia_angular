import { Trigger } from '@/app/main/models';

export interface RawCustomerRating {
    avgRatingThisReview: number;
    countOfReviews: string;
    gr_behavior: string;
    gr_cleanliness: string;
    gr_comment: string;
    gr_date: string;
    gr_externalBooking_id: null | string;
    gr_externalGuest_id: string;
    gr_externalID: null | string;
    gr_fromDate: null | string;
    gr_guest_id: string;
    gr_id: string;
    gr_paymentWilling: string;
    gr_price: null | string;
    gr_respectedHouseRules: string;
    gr_reviewer_id: string;
    gr_serviceCosts: string;
    gr_thumbUp: Trigger;
    gr_untilDate: null | string;
    gr_vipFactor: string;
    overallRatingNetwork: string;
    recommendationPerc: string;
    reviewFound: Trigger;
}

export interface CustomerRating {
    factors: {
        behavior: number;
        payment: number;
        rules: number;
        cleanliness: number;
        costs: number;
        vip: number;
    };
    comment: string;
    thumb: 'up' | 'down' | null;
    countOfReviews: number;
    recommendationPercent: number;
    overallRating: number;
}

export interface Factor {
    id: keyof CustomerRating['factors'];
    label: string;
}
