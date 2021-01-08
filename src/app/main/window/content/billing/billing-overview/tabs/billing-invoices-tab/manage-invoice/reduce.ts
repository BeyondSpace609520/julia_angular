import { parseDate, stringifyDate } from '@/app/helpers/date';
import { Trigger } from '@/app/main/models';
import { reduceCustomer } from '@/app/main/window/shared/customer/reduce';
import {
    Invoice, InvoiceRequestData, Payment, RawInvoice, RawPayment, RawVersionDetail, VersionDetail, PaymentBody, RawPaymentBody
} from './models';

export function reduceInvoice(i: RawInvoice): Invoice {
    return {
        customer: reduceCustomer(i.customer),
        details: i.billVersionDetail ? i.billVersionDetail.map(reduceDetail) : [],
        payments: i.billVersionPayment ? i.billVersionPayment.map(reducePayment) : [],
        invoiceDate: parseDate(i.billBillVersion.b_invoiceDate, false),
        fromDate: parseDate(i.billBillVersion.b_fromDate, false),
        untilDate: parseDate(i.billBillVersion.b_untilDate, false),
        billNo: i.billBillVersion.b_billNo,
        custRegNo: i.billBillVersion.b_custRegNo || '',
        existingBillNo: i.existingBillNo === 'on',
        billSplitId: i.billBillVersion.b_billSplit_id ? +i.billBillVersion.b_billSplit_id : null,
        source: i.b_source,
        cancelled: i.b_cancelled === 'on',
        totalGross: +i.bv_totalGross,
        billingText: i.billBillVersion.bv_billText001,
        bookingId: i.billBillVersion.b_booking_id ? +i.billBillVersion.b_booking_id : null,
        billingId: +i.billBillVersion.b_id,
        billingVersionId: i.billBillVersion.bv_id,
        bookingStatusId: i.b_bookingStatus_id ? +i.b_bookingStatus_id : 0
    };
}


export function reduceDetail(d: RawVersionDetail): VersionDetail {
    return {
        id: d.bvd_id,
        text: d.bvd_freeText || (d.bvd_isRoomBookingDetail === 'on' ? d.bvd_displayText : d.bvd_unitCount + ' * ' + d.bvd_displayText),
        invoiceText: d.bvd_displayText,
        alternativeText: d.bvd_freeText,
        type: d.bvd_type,
        cashRegisterGrouping: d.bvd_cashRegisterGrouping,
        bookingProductId: +d.bvd_bookingProduct_id,
        isRoomBookingDetail: d.bvd_isRoomBookingDetail === 'on',
        insuranceProductId: d.bvd_insuranceProduct_id ? +d.bvd_insuranceProduct_id : null,
        unitPriceGross: +d.bvd_unitPriceGross,
        unitCount: +d.bvd_unitCount,
        totalNet: +d.bvd_totalNet,
        totalTax: +d.bvd_totalTax,
        totalGross: +d.bvd_totalGross,
        taxPerc: d.t_name,
        insuranceProductName: d.insuranceProductName,
        raw: d
    };
}

export function inverseReduceDetail(d: VersionDetail): RawVersionDetail {
    return {
        ...d.raw,
        bvd_displayText: d.invoiceText,
        bvd_freeText: d.alternativeText,
        bvd_type: d.type,
        bvd_cashRegisterGrouping: d.cashRegisterGrouping,
        bvd_bookingProduct_id: String(d.bookingProductId),
        bvd_insuranceProduct_id: d.insuranceProductId ? String(d.insuranceProductId) : null,
        bvd_unitPriceGross: String(d.unitPriceGross),
        bvd_unitCount: String(d.unitCount),
        bvd_totalNet: String(d.totalNet),
        bvd_totalTax: String(d.totalTax),
        bvd_totalGross: String(d.totalGross),
        t_name: d.taxPerc,
        insuranceProductName: d.insuranceProductName
    };
}

export function reducePayment(p: RawPayment): Payment {
    return {
        id: +p.bvp_id,
        rcId: p.rc_id,
        name: p.bvptl_name,
        desc: p.bvp_desc,
        date: parseDate(p.bvp_paymentDate, false),
        amount: +p.bvp_amount,
        isCashPayment: p.bvpt_isCashPayment === 'on',
        typeId: +p.bvptl_billVersionPaymentType_id,
        isLocalPayment: p.bvp_isLocalPayment === 'on',
        versionId: p.bvp_billVersion_id,
        isBookingPrepayment: p.isBookingPrepayment === 'on',
        raw: p
    };
}

// tslint:disable-next-line: max-line-length
export function inverseReducePayment(p: PaymentBody): RawPaymentBody {
    // tslint:disable-next-line: max-line-length
    // https://trello.com/c/2xuMrnhA/62-billing-billing-overview-edit-invoice-items-clickable-icons-and-buttons-part-1-2#comment-5d3ffcc80e3c692274ddfeaf
    const stubFields = {
        bvptl_billVersionPaymentType_id: '0',
        bvp_amountDisplay: null,
        bvpt_id: '0',
        bvpt_name: null,
        rc_id: null,
        bvptl_locale_id: '0',
        isBookingPrepayment: 'off' as Trigger,
        bvpt_active: 'on' as Trigger,
        bvpt_isCreditCard: 'off' as Trigger,
        bvpt_isCustom: 'off' as Trigger,
        bvpt_isCashPaymentAdvanced: 'off' as Trigger,
        bvp_orig_billVersion_id: null,
    };

    return {
        ...(p.raw ? p.raw : stubFields),
        bvp_id: String(p.id || 0),
        bvptl_name: p.name,
        bvp_desc: p.desc,
        bvp_paymentDate: stringifyDate(p.date, false),
        bvp_amount: String(p.amount),
        bvpt_isCashPayment: p.isCashPayment && p.isCashPayment ? 'on' : 'off',
        bvp_billVersionPaymentType_id: String(p.typeId),
        bvp_isLocalPayment: p.isLocalPayment ? 'on' : 'off',
        bvp_billVersion_id: p.versionId,
    };
}

export function prepareInvoiceRequestData(data: InvoiceRequestData) {
    const { customer: c } = data;
    return {
        customer: {
            c_accountNo: c.accountNo,
            c_salutation_id: c.salutation,
            c_title: c.title,
            c_firstName: c.firstName,
            c_lastName: c.lastName,
            c_company: c.company,
            c_eMailAddress: c.email,
            c_addressLine1: c.address,
            c_postCode: c.postCode,
            c_city: c.city,
            c_locale_id: c.locale,
            c_country_id: c.country,
            c_taxNo: c.taxNo,
            c_id: c.id
        },
        billNo: data.billNo,
        regNo: data.regNo,
        billingText: data.billingText,
        date: stringifyDate(data.date, false),
        fromDate: stringifyDate(data.fromDate, false),
        untilDate: stringifyDate(data.untilDate, false)
    };
}
