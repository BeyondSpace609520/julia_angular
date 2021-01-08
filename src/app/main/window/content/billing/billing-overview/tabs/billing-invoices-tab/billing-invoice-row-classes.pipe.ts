import { Pipe, PipeTransform } from '@angular/core';

import { BillingInvoice } from './models';

@Pipe({
  name: 'billingInvoiceRowClasses'
})
export class BillingInvoiceRowClassesPipe implements PipeTransform {

  transform(invoice: BillingInvoice, classes?: string[]): string {
    const classNames: string[] = classes ? classes : [];

    if (invoice.masterBill === 1 && !!invoice.b_billSplit_id) {
      classNames.push('primary');
    }
    if (invoice.masterBill === 0 && !!invoice.b_billSplit_id) {
      classNames.push('secondary');
    }
    if (invoice.bookingAlreadyDeleted) {
      classNames.push('deleted');
    }

    return classNames.join(' ');
  }

}
