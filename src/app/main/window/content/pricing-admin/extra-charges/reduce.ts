import { ChargeType, ExtraCharge, ExtraChargeDetails, ExtraChargeRequestBody, RawExtraCharge, RawExtraChargeDetails } from './models';

export function reduceCharge(c: RawExtraCharge): ExtraCharge {
    return {
        id: +c.oc_id,
        active: c.oc_active === 'on',
        price: +c.oc_price,
        chargeDaily: c.oc_chargeDaily === 'on',
        type: (() => {
            switch (c.oc_chargeType) {
                case 'CleanUpCharge': return ChargeType.CLEAN_UP;
                case 'Cot': return ChargeType.BABY_BED;
                case 'Garage': return ChargeType.PARKING;
                case 'PetChargeLarge': return ChargeType.LARGE_PET;
                case 'PetChargeSmall': return ChargeType.SMALl_PET;
            }
        })(),
        name: `BackEnd_WikiLanguage.EC_${c.oc_chargeType}`,
        priceIncludedAppartment: c.oc_priceIncludedAppartment === 'on',
        priceIncludedStandardRoom: c.oc_priceIncludedStandardRoom === 'on',
        value: c.oc_strValue001
    };
}

export function reduceChargeDetails(c: RawExtraChargeDetails): ExtraChargeDetails {
    return {
        ...reduceCharge(c),
        locales: c.otherChargesLocales.map((l: RawExtraChargeDetails['otherChargesLocales'][0]) => ({
            id: +l.ocl_id,
            localeId: +l.ocl_locale_id,
            text: l.ocl_text,
            otherChargeId: +l.ocl_otherCharges_id
        } as ExtraChargeDetails['locales'][0]))
    };
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export function prepareExtraChargeBody(c: ExtraChargeRequestBody): Omit<RawExtraChargeDetails, 'oc_chargeType'> {
    return {
        oc_id: c.id ? String(c.id) : '',
        oc_active: c.active ? 'on' : 'off',
        oc_chargeDaily: c.chargeDaily ? 'on' : 'off',
        oc_price: String(c.price),
        oc_priceIncludedAppartment: c.priceIncludedAppartment ? 'on' : 'off',
        oc_priceIncludedStandardRoom: c.priceIncludedStandardRoom ? 'on' : 'off',
        oc_strValue001: c.value,
        otherChargesLocales: c.locales.map(l => ({
            ocl_id: String(l.id),
            ocl_text: l.text,
            ocl_otherCharges_id: String(l.otherChargeId),
            ocl_locale_id: String(l.localeId)
        } as RawExtraChargeDetails['otherChargesLocales'][0]))
    };
}
