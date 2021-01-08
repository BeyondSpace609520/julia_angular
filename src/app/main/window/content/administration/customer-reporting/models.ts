export interface RawBillableCustomer {
    c_id: string;
    c_name: string;
    invoiceRecipient: string;
    nextBillDate: string;
}
export interface BillableCustomer {
    id: number;
    name: string;
    invoiceRecipient: string;
    nextBillDate: string;
}
