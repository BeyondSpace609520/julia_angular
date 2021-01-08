import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { PermissionService } from '@/app/main/permission/permission.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ManageInvoiceService } from '../../manage-invoice.service';
import { BillingInvoice } from '../../models';
import { LoaderType } from '../loader-types';
import { Invoice, VersionDetail } from '../models';
import { getEditModal } from './edit/modal';

@Component({
  selector: 'app-invoice-details-table',
  templateUrl: './table.component.pug',
  styleUrls: ['./table.component.sass']
})
export class TableComponent {

  @Input() invoice: Invoice;
  @Input() billing!: BillingInvoice;
  @Output() refresh = new EventEmitter();

  constructor(
    private permission: PermissionService,
    private invoiceService: ManageInvoiceService,
    private modalService: ModalService,
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  async editProduct(item: VersionDetail) {
    const { body, opts } = getEditModal(item, this.invoice.bookingId === null);
    const modalData = await this.modalService.openForms('BackEnd_WikiLanguage.BW_InvoiceDetailTitle', body, opts);

    modalData.modalBody.init(item, this.invoice, this.billing);
    modalData.modal.save.subscribe(async () => {
      await modalData.modalBody.onSaveEdit(modalData.modalBody.extractDetail());
    });
    modalData.modalBody.close.subscribe(async (saved) => {
      modalData.modal.close(true);
      if (saved) {
        this.refresh.emit();
      }
    });
  }

  @Loading(LoaderType.MANAGE_INVOICE)
  async deleteProduct(item: VersionDetail) {
    await this.apiClient.deleteInvoiceVersionDetail(item).toPromise();
    this.invoice.details.splice(this.invoice.details.indexOf(item), 1);
  }
}
