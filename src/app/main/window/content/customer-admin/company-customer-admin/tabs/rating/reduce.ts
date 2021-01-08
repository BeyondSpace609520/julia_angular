import { CustomerRating, RawCustomerRating } from './models';

export function reduceCustomerRating(r?: RawCustomerRating): CustomerRating {
    return {
        factors: {
            behavior: r ? +r.gr_behavior : 0,
            payment: r ? +r.gr_paymentWilling : 0,
            rules: r ? +r.gr_respectedHouseRules : 0,
            cleanliness: r ? +r.gr_cleanliness : 0,
            costs: r ? +r.gr_serviceCosts : 0,
            vip: r ? +r.gr_vipFactor : 0
        },
        comment: r ? r.gr_comment : '',
        thumb: r ? (r.gr_thumbUp === 'on' ? 'up' : r.gr_thumbUp === 'off' ? 'down' : null) : null,
        countOfReviews: r ? +r.countOfReviews : 0,
        recommendationPercent: r ? +r.recommendationPerc : 0,
        overallRating: r ? +r.overallRatingNetwork : 0
    };
}

export function prepareRatingBody(r: CustomerRating) {
    return {
        gr_comment: r.comment,
        gr_thumbUp: r.thumb === 'up' ? 'on' : r.thumb === 'down' ? 'off' : null,
        gr_serviceCosts: r.factors.costs,
        gr_paymentWilling: r.factors.payment,
        gr_vipFactor: r.factors.vip,
        gr_respectedHouseRules: r.factors.rules,
        gr_cleanliness: r.factors.cleanliness,
        gr_behavior: r.factors.behavior
    };
}
