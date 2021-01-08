import { Trigger } from '@/app/main/models';

export interface RawBillingOverviewData {
  b_id: string;
  b_billSplit_id: string | null;
  b_bookingNo: string;
  b_cancellation_b_id: string | null;
  billFromDate: string | null;
  billNo: string;
  billUntilDate: string | null;
  bookingAlreadyDeleted: string;
  bookingLastNameFirstName: string;
  bv_creationDate: string | null;
  cancelled: string;
  c_id: string;
  c_firstName: string;
  c_lastName: string;
  c_accountNo: string;
  c_addressLine1: string;
  c_postCode: string;
  c_city: string;
  country: string;
  lastNameFirstName: string;
  masterBill: string;
  rgText: string;
  taxesList: RawBillingInvoiceTax[];
  showBillSplitIcon: string;
  totalGross: string;
  totalInsuranceProductsAmount: string;
  totalOutstanding: string;
  totalPrepaidAmount: string;
  totalTax: number;
  totalVT: number;
  minArrivalDateUK: string;
  bs_name: string | null;
  billId: string;
  c_eMailAddress: string;
  billFromDateUK: string;
}

export interface RawBillingInvoiceTax {
  sortOrder: string;
  t_decimal: string;
  taxName: string;
  taxNameOrig: string;
  totalTaxGross: string;
  totalTaxNet: string;
  totalTaxTax: string;
  totalTaxVat: string;
}

export interface BillingInvoice {
  b_id: number;
  id: number;
  b_billSplit_id: number | null;
  b_bookingNo: string;
  b_cancellation_b_id: number | null;
  accountNo: string;
  billFromDate: Date | null;
  billNo: string;
  billUntilDate: Date | null;
  bookingAlreadyDeleted: boolean;
  bookingLastNameFirstName: string;
  bv_creationDate: Date | null;
  cancelled: number;
  customerId: number;
  lastNameFirstName: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  postCode: string;
  city: string;
  country: string;
  masterBill: number;
  rgText: string;
  showBillSplitIcon: boolean;
  taxesList: BillingInvoiceTax[];
  totalGross: number;
  totalInsuranceProductsAmount: number;
  totalOutstanding: number | null;
  totalPrepaidAmount: number | null;
  totalTax: number;
  totalVT: number;
  minArrivalDateUK: Date | null;
  bs_name: string | null;
  billId: number;
  c_eMailAddress: string;
  billFromDateUK: string;
}

export interface BillingInvoiceTax {
  taxName: string;
  net: number;
  tax: number;
  gross: number;
  sortOrder: number;
}

export interface BillingInvoiceTotals {
  insuranceProductsAmount?: number;
  net?: number;
  VT?: number;
  tax?: number;
  gross?: number;
  prepaidAmount?: number;
  outstanding?: number;
}

export type InvoiceOutstanding = 'all' | 'with' | 'without';
export type InvoiceDateType = 'arrivalDate' | 'departureDate' | 'invoiceDate';
export type InvoiceType = 'all' | 'bills' | 'preview';

export interface InvoicesRequestParams {
  dateFilterOption: InvoiceDateType;
  filterOption: InvoiceType;
  fromDate: Date;
  outstandingOption: InvoiceOutstanding;
  searchString: string;
  showDeleted: boolean;
  showSplitBills: boolean;
  untilDate: Date;
  performanceDetails: boolean;
}

export interface RawInvoicesRequestParams {
  dateFilterOption: string;
  filterOption: string;
  fromDate: string;
  outstandingOption: string;
  searchString: string;
  showDeleted: Trigger;
  showSplitBills: Trigger;
  untilDate: string;
  performanceDetails: string;
}
