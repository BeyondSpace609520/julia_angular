import { parseDate } from '@/app/helpers/date';
import { Discount } from './models';

export function reduceDiscount<T>(d: T, prefix: string): Discount {
    return {
        id: +d[prefix + '_id'],
        fromDate: parseDate(d[prefix + '_fromDate']),
        untilDate: parseDate(d[prefix + '_untilDate'])
    };
}
