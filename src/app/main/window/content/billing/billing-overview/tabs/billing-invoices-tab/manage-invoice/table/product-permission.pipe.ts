import { Pipe, PipeTransform } from '@angular/core';

import { PermissionService } from '@/app/main/permission/permission.service';
import { ManageInvoiceService } from '../../manage-invoice.service';
import { Invoice, VersionDetail } from '../models';

@Pipe({
  name: 'productPermission'
})
export class ProductPermissionPipe implements PipeTransform {

  constructor(
    private manageInvoiceService: ManageInvoiceService,
    private permissionService: PermissionService,
  ) {}

  transform(
    type: ProductPermissionType,
    item: VersionDetail,
    invoice: Invoice
  ): boolean {
    if (this.hideAction(item, invoice)) {
      return false;
    }
    if (type === 'delete' && invoice.bookingStatusId > 1 && item.insuranceProductId && item.insuranceProductId > 0) {
      return false;
    }
    if (invoice.bookingId === null) {
      return true;
    }
    if (item.cashRegisterGrouping !== null) {
      return false;
    }
    if (type === 'delete') {
      return item.bookingProductId > 0;
    }
    return true;
  }

  private hideAction(item: VersionDetail, invoice: Invoice): boolean {
    return invoice.billSplitId !== null
      || (invoice.existingBillNo && !this.manageInvoiceService.forceEdit)
      || (invoice.source === 'channelmanager' && this.permissionService.can.casablancaNew)
      || (invoice.cancelled && item.type !== 'CancellationFee');
  }
}

export type ProductPermissionType = 'edit' | 'delete';
