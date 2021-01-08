import { FormOption } from '@/app/main/shared/form-data.service';

export interface RawCustomerFormResources {
    characteristicsLocale: {
        chl_characteristics_id: string;
        chl_locale_id: string;
        chl_value: string;
        objId: string;
    }[];
    documentTypeLocale: {
        dtl_documentType_id: string;
        dtl_locale_id: string;
        dtl_value: string;
        objId: string;
    }[];
    arrivalMethodLocale: {
        objId: string;
        aml_locale_id: string;
        aml_value: string;
        aml_visitReason_id: string;
    }[];
    visitReasonLocale: {
        objId: string;
        vrl_locale_id: string;
        vrl_value: string;
        vrl_visitReason_id: string;
    }[];
}

export interface CustomerFormResources {
    characteristics: FormOption[];
    documentTypes: FormOption[];
    arrivalTypes: FormOption[];
    travelPurposes: FormOption[];
}
