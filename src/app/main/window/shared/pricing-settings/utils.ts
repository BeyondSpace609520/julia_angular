import { PricingEntity } from './models';

export function calculateAdultsPrice(ages: PricingEntity['ages']) {
    const ageRange = ages.find((rule) => rule.from === 18);

    return ageRange ? ageRange.price : 0;
}
