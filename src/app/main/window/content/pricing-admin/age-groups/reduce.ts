import { AgeGroup, RawAgeGroup } from './models';

export function reduceAgeGroup(g: RawAgeGroup): AgeGroup {
    return {
        id: +g.ag_id,
        name: g.ag_name,
        from: +g.ag_fromAge,
        to: +g.ag_toAge,
        percDiscount: +g.ag_percDiscount
    };
}

export function prepareAgeGroup(g: AgeGroup): RawAgeGroup {
    return {
        ag_id: String(g.id),
        ag_name: g.name,
        ag_fromAge: String(g.from),
        ag_toAge: String(g.to),
        ag_percDiscount: String(g.percDiscount)
    };
}
