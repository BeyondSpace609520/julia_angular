import { parseDate, stringifyDate } from '@/app/helpers/date';
import {
  BillingInvoice,
  BillingInvoiceTax,
  InvoicesRequestParams,
  RawBillingOverviewData,
  RawBillingInvoiceTax,
  RawInvoicesRequestParams,
} from './models';
// import { StarRatingModule } from 'angular-star-rating';

export function reduceBillingInvoice(data: RawBillingOverviewData): BillingInvoice {
  return {
    b_id: Number(data.b_id),
    id: Number(data.b_id),
    b_billSplit_id: data.b_billSplit_id ? Number(data.b_billSplit_id) : null,
    b_bookingNo: data.b_bookingNo,
    b_cancellation_b_id: data.b_cancellation_b_id
      ? Number(data.b_cancellation_b_id)
      : null,
    accountNo: data.c_accountNo,
    billFromDate: parseDate(data.billFromDate),
    billNo: data.billNo,
    billUntilDate: parseDate(data.billUntilDate),
    bookingAlreadyDeleted: data.bookingAlreadyDeleted === 'on',
    bookingLastNameFirstName: data.bookingLastNameFirstName,
    bv_creationDate: parseDate(data.bv_creationDate),
    cancelled: Number(data.cancelled),
    customerId: Number(data.c_id),
    lastNameFirstName: data.lastNameFirstName,
    firstName: data.c_firstName,
    lastName: data.c_lastName,
    addressLine1: data.c_addressLine1,
    postCode: data.c_postCode,
    city: data.c_city,
    country: data.country,
    masterBill: Number(data.masterBill),
    rgText: data.rgText,
    taxesList: data.taxesList
      ? data.taxesList.map((tax) => reduceBillingInvoiceTax(tax))
      : [],
    showBillSplitIcon: data.showBillSplitIcon === 'on',
    totalGross: Number(data.totalGross),
    totalInsuranceProductsAmount: Number(data.totalInsuranceProductsAmount),
    totalOutstanding: Number(data.masterBill)
      ? null
      : Number(data.totalOutstanding),
    totalPrepaidAmount: Number(data.masterBill)
      ? null
      : Number(data.totalPrepaidAmount),
    totalTax: Number(data.totalTax),
    minArrivalDateUK: parseDate(data.minArrivalDateUK, false),
    totalVT: Number(data.totalVT),
    bs_name: data.bs_name,
    billId: Number(data.billId),
    c_eMailAddress: data.c_eMailAddress,
    billFromDateUK: data.billFromDateUK,
  };
}

export function reduceBillingInvoiceTax(
  data: RawBillingInvoiceTax
): BillingInvoiceTax {
  return {
    taxName: data.taxName,
    net: +data.totalTaxNet,
    tax: +data.totalTaxVat,
    gross: +data.totalTaxGross,
    sortOrder: +data.sortOrder,
  };
}

export function prepareInvoicesParams(p: InvoicesRequestParams): RawInvoicesRequestParams {
  return {
    searchString: p.searchString,
    dateFilterOption: p.dateFilterOption,
    filterOption: p.filterOption,
    outstandingOption: p.outstandingOption,
    fromDate: stringifyDate(p.fromDate, false),
    untilDate: stringifyDate(p.untilDate, false),
    showDeleted: p.showDeleted ? 'on' : 'off',
    showSplitBills: p.showSplitBills ? 'on' : 'off',
    performanceDetails: p.performanceDetails ? 'on' : 'off'
  };
}

export function prepareExportFields(b: BillingInvoice): {[key: string]: string | Date | number} {
  return {
    export_firstName: b.firstName, // b.c_firstName,
    export_lastName: b.lastName, // b.c_lastName,
    export_arrival: b.minArrivalDateUK || '',
    export_departure: b.billUntilDate || '', /// ?,
    export_invoiceNr: b.billNo,
    export_invoiceDate: b.bv_creationDate || '',
    export_bookingNr: b.b_bookingNo,
    export_invoiceText: b.rgText,
    export_net: +(b.totalGross - b.totalTax).toFixed(2),
    export_localTax: +b.totalVT.toFixed(2),
    export_tax: +b.totalTax.toFixed(2),
    export_gross: +b.totalGross.toFixed(2),
    export_depositAmount: b.totalPrepaidAmount
      ? +b.totalPrepaidAmount.toFixed(2)
      : '',
    export_outstanding: b.totalOutstanding
      ? +b.totalOutstanding.toFixed(2)
      : '',
    export_acctNr: b.accountNo, // b.c_accountNo,
    export_address: b.addressLine1, // b.c_addressLine1,
    export_postCode: b.postCode, // b.c_postCode,
    export_city: b.city, // b.c_city,
    export_country: b.country,
  };
}
