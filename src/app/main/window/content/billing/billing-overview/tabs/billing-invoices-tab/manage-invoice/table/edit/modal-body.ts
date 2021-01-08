import { EventEmitter } from '@angular/core';

import { BillingInvoice } from '../../../models';
import { Invoice, VersionDetail } from '../../models';

export interface ModalBody {
    close: EventEmitter<boolean>;
    init(detail: VersionDetail, invoice: Invoice, billing?: BillingInvoice);
    onSaveEdit(d: VersionDetail | null): any;
    extractDetail(): VersionDetail | null;
}
