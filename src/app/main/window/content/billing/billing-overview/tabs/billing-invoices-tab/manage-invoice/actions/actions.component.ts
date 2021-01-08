import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { ManageInvoiceService } from '../../manage-invoice.service';
import { BillingInvoice } from '../../models';
import { FormComponent } from '../form/form.component';
import { LoaderType } from '../loader-types';
import { Invoice } from '../models';
import { NewProductComponent } from './new-product/new-product.component';

@Component({
  selector: 'app-invoice-additional-actions',
  templateUrl: './actions.component.pug',
  styleUrls: ['./actions.component.sass']
})
export class ActionsComponent {

  @Input() invoice!: Invoice;
  @Input() billing!: BillingInvoice;
  @Input() form!: FormComponent;
  @Output() refresh = new EventEmitter();

  constructor(
    private modalService: ModalService,
    private apiClient: ApiClient,
    private loaderService: LoaderService, // needed for @Loading decorator
    public invoiceService: ManageInvoiceService
  ) { }

  addProduct() {
    const modalData = this.modalService.openForms('BackEnd_WikiLanguage.BW_InvoiceDetailTitle', NewProductComponent, {
      ngbOptions: {
        size: 'lg'
      },
      hidePrimaryButton: true
    });

    modalData.modalBody.init(this.invoice, this.billing);
    modalData.modalBody.close.subscribe(async (saved) => {
      modalData.modal.close(true);
      if (saved) {
        this.refresh.emit();
      }
    });
  }

  async generateInvoice() {
    const title = 'BackEnd_WikiLanguage.BW_GenerateInvoiceConfirmationHeader';
    const confirmed = await this.modalService.openConfirm(title, 'BackEnd_WikiLanguage.BW_GenerateInvoiceConfirmationText', {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Yes',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_No'
    });

    if (confirmed) {
      // tslint:disable-next-line: max-line-length
      // https://trello.com/c/SDO17qzj/70-billing-billing-overview-edit-invoice-items-clickable-icons-and-buttons-part-2-2 (Generate invoice button)
      await this.form.save();
      await this.apiClient.generateInvoice(this.invoice).toPromise();
      this.refresh.emit();
    }
  }

  @Loading(LoaderType.MANAGE_INVOICE)
  async previewInvoice() {
    const { billingId, bookingId } = this.invoice;
    await this.form.save();
    const path = await this.apiClient.generateInvoicePDF(billingId, bookingId).toPromise();
    window.open(environment.remoteUrl + path, '_blank');
  }
}
