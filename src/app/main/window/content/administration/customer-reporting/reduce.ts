import { BillableCustomer, RawBillableCustomer } from './models';

export function reduceBillableCustomer(c: RawBillableCustomer): BillableCustomer {
    return {
        id: +c.c_id,
        name: c.c_name,
        invoiceRecipient: c.invoiceRecipient,
        nextBillDate: c.nextBillDate
    };
}
