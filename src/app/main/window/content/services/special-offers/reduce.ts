import { flatten, groupBy } from 'lodash';

import { parseDate, stringifyDate } from '@/app/helpers/date';
import {
  LocalRoomCategory,
  RawLocalRoomCategory,
  RawSpecialOffer, RawSpecialOfferDetails, RawSpecialOfferPeriod,
  RawSpecialOfferPeriodPricing, RawSpecialOfferPricing, SpecialOffer,
  SpecialOfferDetails, SpecialOfferPeriod, SpecialOfferPeriodPricing, SpecialOfferPricing
} from './models';

const UNDEFINED_DATE = '0000-00-00 00:00:00';

export function reduceSpecialOffer(s: RawSpecialOffer): SpecialOffer {
  return {
    id: +s.so_id,
    title: s.sol_title,
    fromDate: UNDEFINED_DATE === s.so_fromDate ? null : parseDate(s.so_fromDate, true),
    untilDate: UNDEFINED_DATE === s.so_untilDate ? null : parseDate(s.so_untilDate, true),
    active: s.so_active === 'on',
    minPersons: +s.so_minPersons,
    maxPersons: +s.so_maxPersons,
    nightsStay: +s.so_nightsStay,
    bookableFromDate: UNDEFINED_DATE === s.so_bookableFromDate ? null : parseDate(s.so_bookableFromDate),
    bookableUntilDate: UNDEFINED_DATE === s.so_bookableUntilDate ? null : parseDate(s.so_bookableUntilDate),
    days: {
      mo: s.so_anMon === 'on',
      tu: s.so_anTue === 'on',
      we: s.so_anWed === 'on',
      th: s.so_anThu === 'on',
      fr: s.so_anFri === 'on',
      sa: s.so_anSat === 'on',
      su: s.so_anSun === 'on',
    },
    individualCatering: s.so_individualCatering === 'on'
  };
}

export function reduceSpecialOfferDetails(s: RawSpecialOfferDetails): SpecialOfferDetails {
  return {
    ...reduceSpecialOffer(s),
    longDesc: s.sol_longDesc,
    shortDesc: s.sol_shortDesc,
    sortOrder: s.so_sortOrder,
    serviceTypeId: +s.so_serviceType_id,
    categoryId: s.so_specialOfferCategory_id && +s.so_specialOfferCategory_id ? +s.so_specialOfferCategory_id : null,
    highlighted: s.so_highlighted === 'on',
    image: s.so_img001
  };
}


type BodyFields = 'so_id' | 'sol_title' | 'sol_longDesc' | 'sol_longDescText' | 'sol_shortDesc' | 'sol_shortDescText'
  | 'so_highlighted' | 'so_serviceType_id' | 'so_sortOrder' | 'so_specialOfferCategory_id' | 'so_active';
type RawSpecialOfferBody = Pick<RawSpecialOfferDetails, BodyFields> & { l_id: string; };

export function prepareSpecialOfferBody(s: SpecialOfferDetails, localeId: number): RawSpecialOfferBody {
  const extractText = html => {
    const el = document.createElement('div');

    el.innerHTML = html;
    return el.innerText;
  };
  return {
    so_id: String(s.id),
    sol_title: s.title,
    sol_longDesc: s.longDesc,
    sol_longDescText: extractText(s.longDesc),
    sol_shortDesc: s.shortDesc,
    sol_shortDescText: extractText(s.shortDesc),
    so_highlighted: s.highlighted ? 'on' : 'off',
    so_serviceType_id: String(s.serviceTypeId),
    so_sortOrder: s.sortOrder,
    l_id: String(localeId),
    so_specialOfferCategory_id: s.categoryId ? String(s.categoryId) : '0',
    so_active: s.active ? 'on' : 'off'
  };
}

export function reduceSpecialOfferPricing(p: RawSpecialOfferPricing): SpecialOfferPricing {
  return {
    offer: reduceSpecialOffer(p),
    periods: p.specialOfferPeriod.map(reduceSpecialOfferPeriod),
    ...reduceSpecialOfferPeriodPricing(p)
  };
}

type SpecialOfferPricingBody = Pick<RawSpecialOfferPricing,
  'so_id' | 'so_fromDate' | 'so_untilDate' | 'so_bookableFromDate' | 'so_bookableUntilDate' | 'so_nightsStay' |
  'so_minPersons' | 'so_maxPersons' | 'so_individualCatering' | 'so_anMon' | 'so_anTue' | 'so_anWed' | 'so_anThu' |
  'so_anFri' | 'so_anSat' | 'so_anSat' | 'so_anSun' | 'entityGroup' | 'specialOfferPeriod' | 'specialOfferPeriod'
  >;

export function prepareSpecialOfferPricingItems(
  ageGroups: SpecialOfferPeriodPricing['ageGroups'],
  prices: SpecialOfferPeriodPricing['prices']
) {
  const allAgeGroups = [{ from: 18, to: 150 }, ...ageGroups];

  return flatten(prices.map(p => {
    return [p.adult, ...p.ages].map((age, ageIndex) => ({
      sopeg_price: String(age.price),
      fromAge: String(allAgeGroups[ageIndex].from),
      sopeg_cateringQuota: String(p.cateringQuota),
      sopeg_roomCharge: String(age.charge),
      toAge: String(allAgeGroups[ageIndex].to),
      sopeg_entityGroup_id: String(p.categoryId)
    }));
  }));
}

export function prepareSpecialOfferPricingBody(offer: SpecialOffer, pricing: SpecialOfferPricing): SpecialOfferPricingBody {
  return {
    so_id: String(offer.id),
    so_fromDate: stringifyDate(offer.fromDate, false),
    so_untilDate: stringifyDate(offer.untilDate, false),
    so_bookableFromDate: stringifyDate(offer.bookableFromDate, false),
    so_bookableUntilDate: stringifyDate(offer.bookableUntilDate, false),
    so_nightsStay: String(offer.nightsStay),
    so_minPersons: String(offer.minPersons),
    so_maxPersons: String(offer.maxPersons),
    so_individualCatering: offer.individualCatering ? 'on' : 'off',
    so_anMon: offer.days.mo ? 'on' : 'off',
    so_anTue: offer.days.tu ? 'on' : 'off',
    so_anWed: offer.days.we ? 'on' : 'off',
    so_anThu: offer.days.th ? 'on' : 'off',
    so_anFri: offer.days.fr ? 'on' : 'off',
    so_anSat: offer.days.sa ? 'on' : 'off',
    so_anSun: offer.days.su ? 'on' : 'off',
    entityGroup: prepareSpecialOfferPricingItems(pricing.ageGroups, pricing.prices),
    specialOfferPeriod: pricing.periods.map(p => ({
      sop_id: String(p.id),
      sop_isChild: p.isChild ? 'on' : 'off',
      sop_untilDate: stringifyDate(p.untilDate, false),
      sop_fromDate: stringifyDate(p.fromDate, false),
    }))
  };
}

export function reduceSpecialOfferPeriod(p: RawSpecialOfferPeriod): SpecialOfferPeriod {
  return {
    id: +p.sop_id,
    isChild: p.sop_isChild === 'on',
    fromDate: parseDate(p.sop_fromDate),
    untilDate: parseDate(p.sop_untilDate)
  };
}

export function reduceSpecialOfferPeriodPricing(p: RawSpecialOfferPeriodPricing): SpecialOfferPeriodPricing {
  const pricesGroups = groupBy(p.ageGroupPrice, item => item.sopeg_entityGroup_id);

  return {
    ageGroups: p.ageGroup.map(item => ({
      from: +item.sopeg_fromAge,
      to: +item.sopeg_toAge
    })),
    prices: Object.keys(pricesGroups).map(key => {
      const items = pricesGroups[key];
      const item = items[0];
      const adultItem = items.find(g => g.sopeg_fromAge === '18' && g.sopeg_toAge === '150');

      return {
        categoryId: +item.sopeg_entityGroup_id,
        cateringQuota: +item.sopeg_cateringQuota,
        adult: {
          price: adultItem ? +adultItem.sopeg_price : 0,
          charge: adultItem ? +adultItem.sopeg_roomCharge : 0
        },
        ages: p.ageGroup.map(age =>
          items.find(agePrice => agePrice.sopeg_fromAge === age.sopeg_fromAge && agePrice.sopeg_toAge === age.sopeg_toAge)
        ).filter(g => g !== adultItem).map(g => {
          if (!g) { throw new Error('Relevant prices for age group not found'); }
          return {
            price: +g.sopeg_price,
            charge: +g.sopeg_roomCharge
          };
        })
      };
    })
  };
}

export function reduceLocalRoomCategory(raw: RawLocalRoomCategory): LocalRoomCategory {
  return {
    id: +raw.id,
    label: raw.egl_value,
    localeId: +raw.egl_id,
    name: raw.eg_name,
    sortOrder: raw.eg_sortOrder
  };
}
