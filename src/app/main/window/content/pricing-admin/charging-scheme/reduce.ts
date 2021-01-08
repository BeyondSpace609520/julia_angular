import { parseDate, stringifyDate } from '@/app/helpers/date';
import {
    AnyChargingScheme, CateringSchemeType, ChargingSchemeBody, ChargingSchemeCharges,
    ChargingSchemeChildCharge, ChargingSchemeDetail, ChargingSchemeType1, ChargingSchemeType2,
    ChargingSchemeType3, RawChargingScheme, RawChargingSchemeBody, RawChargingSchemeDetail,
} from './models';

function parseCharges(data: string): ChargingSchemeCharges {
    const allCharges: ChargingSchemeChildCharge[] = data.split(';').map(item => item.split(':')).map(([from, to, charge]) => ({
        from: +from,
        to: +to,
        charge: +charge
    }));
    const adultCharge = allCharges.find(ch => ch.from === 18 && ch.to === 150);
    return {
        adult: adultCharge ? +adultCharge.charge : 0,
        children: allCharges.filter(ch => !(ch.from === 18 && ch.to === 150))
    };
}

function parseChargeByType(type: 'ExtraChargeOverDayOfWeekPeriod', data: string): ChargingSchemeType1['charges'];
function parseChargeByType(type: 'ExtraChargeOverPeriod', data: string): ChargingSchemeType2['charges'];
function parseChargeByType(type: 'FixedAmountOnNightsStay', data: string): ChargingSchemeType3['charges'];
function parseChargeByType(type: CateringSchemeType, data: string) {
    switch (type) {
        case 'ExtraChargeOverDayOfWeekPeriod': return data.split('°').reduce((acc, item) => {
            const [week, ...args] = item.split(':');

            return { ...acc, [week]: parseCharges(args.join(':'))};
        }, {}) as ChargingSchemeType1['charges'];
        case 'ExtraChargeOverPeriod': return parseCharges(data) as ChargingSchemeType2['charges'];
        case 'FixedAmountOnNightsStay': return data.split('°').reduce((acc, item) => {
            const [week, ...args] = item.split(':');

            return { ...acc, [week]: parseCharges(args.join(':'))};
        }, {}) as ChargingSchemeType3['charges'];
        default: throw new Error('parseChargeByType wrong type');
    }
}

export function reduceChargingScheme(c: RawChargingScheme): AnyChargingScheme {
    const type = c.cs_name as any;

    return {
        id: +c.acs_id,
        name: c.acs_name,
        startDate: parseDate(c.acs_param001, false),
        endDate: parseDate(c.acs_param002, false),
        chargeType: c.acs_param003,
        charges: parseChargeByType(type, c.acs_param004),
        forPeriod: c.acs_param005 === 'on',
        nights: +c.acs_param005,
        type
    };
}

export function reduceChargingSchemeDetail(c: RawChargingSchemeDetail): ChargingSchemeDetail<AnyChargingScheme> {
    return {
        ...reduceChargingScheme(c),
        translations: c.toolTips.map(t => ({
            localeId: +t.acsl_locale_id,
            text: t.acsl_toolTip
        }) as ChargingSchemeDetail<AnyChargingScheme>['translations'][0])
    };
}

export function inverseCharges(c: ChargingSchemeCharges): string {
    const list: ChargingSchemeChildCharge[] = [
        { from: 18, to: 150, charge: c.adult },
        ...c.children
    ];

    return list.map(({ from, to, charge }) => `${from}:${to}:${charge}`).join(';');
}

// tslint:disable-next-line: max-line-length
export function prepareChargingSchemeBody(d: ChargingSchemeBody<ChargingSchemeDetail<AnyChargingScheme>>): RawChargingSchemeBody {
    const type = d.type;
    const data = d as unknown as AnyChargingScheme;

    return {
        acs_id: d.id ? String(d.id) : undefined,
        acs_name: d.name,
        acs_param001: stringifyDate(d.startDate, false),
        acs_param002: stringifyDate(d.endDate, false),
        acs_param003: 'chargeType' in data ? data.chargeType : null,
        // tslint:disable-next-line: max-line-length
        acs_param004: data.type === 'ExtraChargeOverPeriod' ? inverseCharges(data.charges) : Object.keys(data.charges).map(week => `${week}:${inverseCharges(d.charges[week])}`).join('°'),
        acs_param005: 'forPeriod' in data && data.forPeriod ? 'on' : ('nights' in data ? String(data.nights) : 'off'),
        cs_name: type,
        toolTips: d.translations.map(t => ({
            acsl_locale_id: String(t.localeId),
            acsl_toolTip: String(t.text)
        }) as RawChargingSchemeDetail['toolTips'][0])
    };
}
