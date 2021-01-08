import { Trigger } from '@/app/main/models';
import { RawCustomer } from '@/app/main/window/content/customer-admin/company-customer-admin/models';
import { Customer } from '@/app/main/window/shared/customer/models';

export interface VersionDetail {
    id: string;
    text: string;
    invoiceText: string;
    alternativeText: string;
    type: string;
    cashRegisterGrouping: string | null;
    bookingProductId: number;
    isRoomBookingDetail: boolean;
    insuranceProductId: number | null;
    unitPriceGross: number;
    unitCount: number;
    totalNet: number;
    totalTax: number;
    totalGross: number;
    taxPerc: string;
    insuranceProductName: string | null;
    raw: RawVersionDetail;
}

export interface Payment {
    id: number;
    rcId: null | string;
    name: string;
    desc: string;
    date: Date;
    amount: number;
    isCashPayment: boolean;
    typeId: number;
    isLocalPayment: boolean;
    versionId: string;
    isBookingPrepayment: boolean;
    raw?: RawPayment;
}


export interface Invoice {
    customer: Customer;
    invoiceDate: Date | null;
    fromDate: Date | null;
    untilDate: Date | null;
    billNo: string;
    custRegNo: string;
    details: VersionDetail[];
    payments: Payment[];
    existingBillNo: boolean;
    billSplitId: number | null;
    source: string;
    cancelled: boolean;
    totalGross: number;
    billingText: string;
    bookingId: number | null;
    bookingStatusId: number;
    billingId: number;
    billingVersionId: string;
}

export interface InvoiceIdentifier {
    billId: number;
    bookingId: number;
}

export interface InvoiceRequestData {
    customer: {
        accountNo: string;
        address: string;
        city: string;
        company: string;
        country: string;
        email: string;
        firstName: string;
        id: number;
        invoiceNo: string;
        lastName: string;
        locale: string;
        postCode: string;
        salutation: string;
        taxNo: string;
        title: string;
    };
    billNo: string;
    regNo: string;
    billingText: string;
    date: Date;
    fromDate: Date;
    untilDate: Date;
}

export interface RawVersionDetail {
    bvd_additionalInfo: null | string;
    bvd_billVersionPaymentType_id: string;
    bvd_billVersion_id: string;
    bvd_bookingProduct_id: string;
    bvd_cashRegisterGrouping: null | string;
    bvd_consumptionDate: null | string;
    bvd_displayText: string;
    bvd_freeText: string;
    bvd_id: string;
    bvd_insuranceProduct_id: null | string;
    bvd_isLocalPayment: Trigger;
    bvd_isRoomBookingDetail: Trigger;
    bvd_orig_billVersionDetail_id: null | string;
    bvd_paymentDate: string;
    bvd_paymentDescription: string;
    bvd_prepaymentAmountPaid: string;
    bvd_productAgeGroupPrice_id: string;
    bvd_product_id: null | string;
    bvd_source: null | string;
    bvd_tax_id: string;
    bvd_totalGross: string;
    bvd_totalNet: string;
    bvd_totalTax: string;
    bvd_type: string;
    bvd_unitCount: string;
    bvd_unitPriceGross: string;
    insuranceProductName: null | string;
    t_name: string;
}

export interface RawPayment {
    bvp_amount: string;
    bvp_amountDisplay: null;
    bvp_billVersionPaymentType_id: string;
    bvp_billVersion_id: string;
    bvp_desc: string;
    bvp_id: string;
    bvp_isLocalPayment: Trigger;
    bvp_orig_billVersion_id: null;
    bvp_paymentDate: string;
    bvpt_active: Trigger;
    bvpt_id: string;
    bvpt_isCashPayment: Trigger;
    bvpt_isCashPaymentAdvanced: Trigger;
    bvpt_isCreditCard: Trigger;
    bvpt_isCustom: Trigger;
    bvpt_name: string;
    bvptl_billVersionPaymentType_id: string;
    bvptl_locale_id: string;
    bvptl_name: string;
    isBookingPrepayment: Trigger;
    rc_id: string;
}

export interface RawInvoice {
    customer: RawCustomer;
    billBillVersion: {
        b_billNo: string;
        b_billSplit_id: null | string;
        b_booking_id: string;
        b_cancellation_b_id: null
        b_custRegNo: null | string;
        b_customer_id: string;
        b_dueDate: null | string;
        b_fromDate: string;
        b_id: string;
        b_invoiceDate: string;
        b_standAlone: string;
        b_untilDate: string;
        b_workingBill: string;
        bv_billText001: string;
        bv_bill_id: string;
        bv_creationDate: string;
        bv_id: string;
        bv_invoiceXML: null | string;
        bv_totalNet: string;
        bv_totalTax: string;
    };
    billVersionDetail: null | RawVersionDetail[];
    billVersionPayment: null | RawPayment[];
    b_invoiceDate: Date;
    b_fromDate: Date;
    b_untilDate: Date;
    b_billNo: string;
    b_custRegNo: string;
    existingBillNo: Trigger;
    b_source: string;
    b_cancelled: Trigger;
    bv_totalGross: string;
    b_bookingStatus_id: string;
}

export type PaymentBody = Omit<Payment, 'id' | 'name'> & { id: null | number; name: string | null };
export type RawPaymentBody = Omit<RawPayment, 'bvp_id' | 'bvptl_name' | 'bvpt_name' | 'rc_id'> & {
    rc_id: null | string;
    bvp_id: null | string;
    bvptl_name: null | string;
    bvpt_name: null | string
};
