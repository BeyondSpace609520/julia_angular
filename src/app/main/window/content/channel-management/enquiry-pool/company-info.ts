import { Enquiry } from './models';

export type Label = string;
export type CompanyDetail = Array<false | string | [Label, string]>;

export function companyDetails(enquiry: Enquiry): CompanyDetail {
    const isRange = enquiry.raw.rangeEnquiry === 'on';

    return [
        ['BackEnd_WikiLanguage.EBP_Title', enquiry.raw.ep_title],
        ['BackEnd_WikiLanguage.EBP_FirstName', enquiry.raw.ep_firstname],
        ['BackEnd_WikiLanguage.EBP_LastName', enquiry.raw.ep_name],
        ['BackEnd_WikiLanguage.EBP_Address', enquiry.raw.ep_addressLine1],
        ['BackEnd_WikiLanguage.RA_postCode', enquiry.raw.ep_postCode],
        ['BackEnd_WikiLanguage.RA_city', enquiry.raw.ep_city],
        ['BackEnd_WikiLanguage.SOP_NumPersonsLabel', enquiry.raw.ep_noOfPersons],
        ['BackEnd_WikiLanguage.SOP_NumChildrenLabel', enquiry.raw.ep_noOfChildren],
        ['BackEnd_WikiLanguage.EBP_EMail', enquiry.raw.ep_email],
        ['BackEnd_WikiLanguage.EBP_PhoneNo', enquiry.raw.ep_phone],
        ['BackEnd_WikiLanguage.eqpToolTipMainRoomCat', enquiry.raw.mainCategory],
        ['BackEnd_WikiLanguage.eqpToolTipAltRoomCat', enquiry.raw.altCategory],
        ['BackEnd_WikiLanguage.EP_Catering', enquiry.raw.catering],
        ['BackEnd_WikiLanguage.EBP_Comments', enquiry.raw.ep_comment],
        ' ',
        !isRange && ['BackEnd_WikiLanguage.GC_ToolTipCanArrive', enquiry.raw.arrivalTooltip],
        !isRange && ['BackEnd_WikiLanguage.GC_ToolTipCanDepart', enquiry.raw.departureTooltip],
        isRange && ['BackEnd_WikiLanguage.flexibleEnquiry', ''],
        isRange && ['BackEnd_WikiLanguage.SP_FromDate', enquiry.raw.arrivalTooltip],
        isRange && ['BackEnd_WikiLanguage.SP_UntilDate', enquiry.raw.departureTooltip],
        isRange && ['BackEnd_WikiLanguage.generic_Nights', enquiry.raw.ep_nights],
        ' ',
        ['BackEnd_WikiLanguage.EBP_Country', enquiry.raw.cl_name],
        ['BackEnd_WikiLanguage.EBP_Locale', enquiry.raw.language]
    ];
}
