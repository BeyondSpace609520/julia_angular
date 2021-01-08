import { groupBy, uniqBy } from 'lodash';

import { parseDate } from '@/app/helpers/date';
import {
    CateringEntity, PersonPricingEntity, Pricing, PricingConfig, PricingEntity,
    PricingScheme, PricingSource, RawPricing, RawPricingBody, RawPricingConfig, RawPricingScheme, RawServiceType, ServiceType
} from './models';
import { calculateAdultsPrice } from './utils';

// tslint:disable-next-line: max-line-length
function reducePersonPricing(p: RawPricing['seasonPeriodEntityPrice'][0], personGroups: RawPricing['seasonPeriodEntityPrice']): PersonPricingEntity {
    // tslint:disable-next-line: max-line-length
    const ages: PricingEntity['ages'] = personGroups.map((groupItem: RawPricing['seasonPeriodEntityPrice'][0]) => ({
        from: +groupItem.spep_fromAge,
        to: +groupItem.spep_toAge,
        price: +groupItem.spep_price,
    }));
    const pr: PersonPricingEntity = {
        typeId: +p.spep_serviceType_id,
        seasonPeriodEntityId: +p.spep_seasonPeriodEntity_id,
        isStdPricePosition: p.spep_isStdPricePosition === 'on',
        adultPrice: calculateAdultsPrice(ages),
        percDiscount: +p.spep_percDiscount,
        personsNo: +p.spep_personsNo,
        ages: ages.filter(g => +g.from !== 18)
    };

    return pr;
}

export function reducePricing(s: RawPricing): Pricing {
    const uniqCaterings = uniqBy(s.seasonPeriodEntityEntityGroupServiceType, c => c.speegst_serviceType_id);
    const groups = groupBy(s.seasonPeriodEntityEntityGroupServiceType, c => c.speegst_serviceType_id);

    const serviceTypeGroups: {[typeId: string]: RawPricing['seasonPeriodEntityPrice']} = groupBy(
      s.seasonPeriodEntityPrice, c => c.spep_serviceType_id
    );
    let stdAdultPrice = 0;
    if (s.seasonPeriodEntityPrice) {
        const adultPriceHelper = s.seasonPeriodEntityPrice.find((spep) =>
          +spep.spep_fromAge === 18 && spep.spep_isStdPricePosition === 'on'
        );
        if (adultPriceHelper) {
            stdAdultPrice = +adultPriceHelper.spep_price;
        }
    }

    const prices: {[typeId: string]: PersonPricingEntity[] } = {};
    Object.keys(serviceTypeGroups).map(typeId => {
        // tslint:disable-next-line: max-line-length
        const groupByPersonNo: {[personNo: string]: RawPricing['seasonPeriodEntityPrice']} = groupBy(serviceTypeGroups[typeId], c => c.spep_personsNo);
        prices[typeId] = Object.values(groupByPersonNo).map(group => reducePersonPricing(group[0], group));
    });

    return {
        pricingSchemeId: +s.spe_pricingScheme_id,
        cleanUpPrice: s.spe_cleanUpPrice,
        minPersons: +s.spe_minPersons,
        maxPersons: +s.spe_maxPersons,
        stdPricePosition: +s.spe_stdPricePosition,
        stdAdultPrice,
        childDiscountStartPosition: +s.spe_childDiscountStartPosition,
        childUnderXForFree: +s.spe_childUnderXForfree,
        categoryName: s.egl_value,
        seasonPeriodId: +s.spe_seasonPeriodEntity_id,
        caterings: uniqCaterings.map((c: RawPricing['seasonPeriodEntityEntityGroupServiceType'][0]) => {
            // tslint:disable-next-line: max-line-length
            const ages: PricingEntity['ages'] = groups[c.speegst_serviceType_id].map((groupItem: RawPricing['seasonPeriodEntityEntityGroupServiceType'][0]) => ({
                from: +groupItem.speegst_fromAge,
                to: +groupItem.speegst_toAge,
                price: +groupItem.speegst_price,
            }));
            const cat: CateringEntity = {
                typeId: +c.speegst_serviceType_id,
                active: c.speegst_active === 'on',
                adultPrice: calculateAdultsPrice(ages),
                entityGroupId: +c.speegst_entityGroup_id,
                seasonPeriodEntityId: +c.speegst_seasonPeriodEntity_id,
                stdDisplayPrice: c.speegst_stdDisplayPrice === 'on',
                ages
            };
            return cat;
        }),
        ageGroups: s.ageGroup ? s.ageGroup.map(g => ({
            from: +g.spep_fromAge,
            to: +g.spep_toAge,
            percDiscount: +g.spep_percDiscount,
        })) : [],
        prices
    };
}

export function preparePricingBody(p: Pricing): RawPricingBody {
    const convertAges = (ages: PricingEntity['ages'], appendPerc = false) => {
        // tslint:disable-next-line: max-line-length
        const perc = (age: PricingEntity['ages'][0]) => (p.ageGroups.find(g => g.from === age.from && g.to === age.to) as Pricing['ageGroups'][0]).percDiscount;
        const suffix = (age: PricingEntity['ages'][0]) => appendPerc ? `_${perc(age)}` : '';

        return ages.reduce((obj, g) => ({
            ...obj,
            ['ag' + g.from + '_' + g.to]: g.price + suffix(g)
        }), {});
    };
    const caterings: RawPricingBody['seasonPeriodEntityEntityGroupServiceType'] = p.caterings ? p.caterings.map(c => {
        return {
            speegst_active: c.active ? 'on' : 'off',
            speegst_stdDisplayPrice: c.stdDisplayPrice ? 'on' : 'off',
            st_id: String(c.typeId),
            adultPrice: c.adultPrice,
            ...convertAges(c.ages)
        };
    }) : [];
    const prices: RawPricingBody['seasonPeriodEntityPrice'] = [];
    Object.keys(p.prices).map(serviceTypeId => {
        const personsGroup = p.prices[serviceTypeId];
        personsGroup.forEach(persons => {
            prices.push({
                isStdPricePosition: persons.isStdPricePosition ? 'on' : 'off',
                personsNo: String(persons.personsNo),
                adultPrice: String(persons.adultPrice),
                serviceTypeId: String(persons.typeId),
                ...convertAges(persons.ages, true)
            });
        });
    });

    return {
        spe_pricingScheme_id: String(p.pricingSchemeId),
        spe_cleanUpPrice: String(p.cleanUpPrice),
        spe_childUnderXForfree: String(p.childUnderXForFree),
        spe_minPersons: String(p.minPersons),
        spe_maxPersons: String(p.maxPersons),
        spe_stdPricePosition: String(p.stdPricePosition),
        spe_childDiscountStartPosition: String(p.childDiscountStartPosition),
        seasonPeriodEntityEntityGroupServiceType: caterings,
        seasonPeriodEntityPrice: prices,
        ageGroup: null,
        spe_id: null,
        egl_value: p.categoryName,
        spe_seasonPeriodEntity_id: String(p.seasonPeriodId)
    };
}

export function reducePricingScheme(s: RawPricingScheme): PricingScheme {
    return {
      id: +s.ps_id,
      // name is used in some static text comparissons to display features in age categories
      name: s.ps_name,
      nameLang: s.psl_name,
    };
}


export function reduceServiceType(s: RawServiceType): ServiceType {
    return {
        id: +s.st_id,
        name: s.stl_name,
        active: s.st_active === 'on'
    };
}

export function reducePricingConfig(p: RawPricingConfig): { period: PricingConfig, source: PricingConfig } {
    const reduceType = (prefix: 'sp_' | 'spe_'): PricingConfig => ({
        id: +p[`${prefix}id`],
        arrival: {
            monday: p[`${prefix}anMon`] === 'on',
            tuesday: p[`${prefix}anTue`] === 'on',
            wednesday: p[`${prefix}anWed`] === 'on',
            thursday: p[`${prefix}anThu`] === 'on',
            friday: p[`${prefix}anFri`] === 'on',
            saturday: p[`${prefix}anSat`] === 'on',
            sunday: p[`${prefix}anSun`] === 'on',
        },
        departure: {
            monday: p[`${prefix}abMon`] === 'on',
            tuesday: p[`${prefix}abTue`] === 'on',
            wednesday: p[`${prefix}abWed`] === 'on',
            thursday: p[`${prefix}abThu`] === 'on',
            friday: p[`${prefix}abFri`] === 'on',
            saturday: p[`${prefix}abSat`] === 'on',
            sunday: p[`${prefix}abSun`] === 'on',
        },
        allowBooking: p[`${prefix}allowBooking`] === 'on',
        allowEnquiry: p[`${prefix}allowEnquiry`] === 'on',
        allowReservation: p[`${prefix}allowReservation`] === 'on',
        fromDate: parseDate(p[`${prefix}fromDate`], false),
        untilDate: parseDate(p[`${prefix}untilDate`], false),
        maxStay: +p[`${prefix}maxStay`],
        minStay: +p[`${prefix}minStay`],
        useLongStayDiscount: p[`${prefix}useLongStayDiscount`] === 'on',
        useNightsMultiple: p[`${prefix}useNightsMultiple`] === 'on',
        finalCleanUp: +p[`${prefix}cleanUpPrice`]
    });

    return {
        period: reduceType('sp_'),
        source: reduceType('spe_')
    };
}

export function preparePricingConfigBody(c: PricingConfig, source: PricingSource) {
    return {
        spe_id: String(c.id),
        entityGroupUpdate: source.type === 'category' ? 'true' : 'false',
        updateForAllEntitiesOfThisGroup: false,
        spe_minStay: c.minStay,
        spe_maxStay: c.maxStay,
        spe_anMon: c.arrival.monday ? 'on' : 'off',
        spe_anTue: c.arrival.tuesday ? 'on' : 'off',
        spe_anWed: c.arrival.wednesday ? 'on' : 'off',
        spe_anThu: c.arrival.thursday ? 'on' : 'off',
        spe_anFri: c.arrival.friday ? 'on' : 'off',
        spe_anSat: c.arrival.saturday ? 'on' : 'off',
        spe_anSun: c.arrival.sunday ? 'on' : 'off',
        spe_abMon: c.departure.monday ? 'on' : 'off',
        spe_abTue: c.departure.tuesday ? 'on' : 'off',
        spe_abWed: c.departure.wednesday ? 'on' : 'off',
        spe_abThu: c.departure.thursday ? 'on' : 'off',
        spe_abFri: c.departure.friday ? 'on' : 'off',
        spe_abSat: c.departure.saturday ? 'on' : 'off',
        spe_abSun: c.departure.sunday ? 'on' : 'off',
        spe_useNightsMultiple: c.useNightsMultiple ? 'on' : 'off',
        spe_allowEnquiry: c.allowEnquiry ? 'on' : 'off',
        spe_allowReservation: c.allowReservation ? 'on' : 'off',
        spe_cleanUpPrice: c.finalCleanUp // TODO format number
    };
}
