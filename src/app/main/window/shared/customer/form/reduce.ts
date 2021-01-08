import { FormOption } from '@/app/main/shared/form-data.service';
import { CustomerFormResources, RawCustomerFormResources } from './models';

export function reduceCustomerFormResources(d: RawCustomerFormResources): CustomerFormResources {
    return {
        characteristics: d.characteristicsLocale.map(c => ({
            value: c.objId,
            name: c.chl_value
        }) as FormOption),
        documentTypes: d.documentTypeLocale.map(t => ({
            value: t.objId,
            name: t.dtl_value
        }) as FormOption),
        arrivalTypes: d.arrivalMethodLocale.map(a => ({
            value: a.objId,
            name: a.aml_value
        }) as FormOption),
        travelPurposes: d.visitReasonLocale.map(a => ({
            value: a.objId,
            name: a.vrl_value
        }) as FormOption),
    };
}
