export interface RawAgeGroup {
    ag_fromAge: string;
    ag_id: string;
    ag_name: string;
    ag_percDiscount: string;
    ag_toAge: string;
}

export interface AgeGroup {
    id: number;
    name: string;
    from: number;
    to: number;
    percDiscount: number;
}
