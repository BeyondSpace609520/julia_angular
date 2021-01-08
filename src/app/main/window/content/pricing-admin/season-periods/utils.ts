import { SeasonPeriod } from './models';

// pairs of neighboring periods: 0,1, 1,2, 2,3,..
function getPeriodPairs(periods: SeasonPeriod[]) {
    const pairs: [SeasonPeriod, SeasonPeriod][] = [];

    for (let i = 1; i < periods.length; i++) {
        pairs.push([periods[i - 1], periods[i]]);
    }
    return pairs;
}

// periods must be sorted by date
export function findInconsecutivePeriod(periods: SeasonPeriod[]) {
    const inconsecutivePair = getPeriodPairs(periods).find(([p1, p2]) => p2.untilDate.getTime() !== p1.fromDate.getTime());

    return inconsecutivePair ? inconsecutivePair[1] : null;
}
