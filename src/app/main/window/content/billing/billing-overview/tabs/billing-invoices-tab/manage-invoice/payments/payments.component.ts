import { printReceipt } from '@/app/main/window/content/billing/billing-overview/tabs/billing-invoices-tab/manage-invoice/payments/print-receipt';
import { sendReceipt } from '@/app/main/window/content/billing/billing-overview/tabs/billing-invoices-tab/manage-invoice/payments/send-receipt';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiClient } from '@/app/helpers/api-client';
import { redirectWithPOST } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { LoaderType } from '../loader-types';
import { Invoice, Payment } from '../models';
import { inverseReducePayment } from '../reduce';
import { PrintPaymentIframeComponent } from './print-payment-iframe/print-payment-iframe.component';
import { SavePaymentModalComponent } from './save-payment-modal/save-payment-modal.component';
import { SendConfirmationComponent } from './send-confirmation/send-confirmation.component';

@Component({
  selector: 'app-invoice-payments',
  templateUrl: './payments.component.pug',
  styleUrls: ['./payments.component.sass']
})
export class PaymentsComponent implements OnDestroy {

  @Input() invoice!: Invoice;
  @Output() refresh = new EventEmitter();

  constructor(
    private modalService: ModalService,
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }


  editPayment(item: Payment) {
    const modalData = this.modalService.openForms('BackEnd_WikiLanguage.BW_BillVersionPayment', SavePaymentModalComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Save',
      disableClose: true
    });

    modalData.modalBody.init(this.invoice, modalData.modal, item);
    modalData.modalBody.saved.subscribe(() => this.refresh.emit());
  }

  async deletePayment(item: Payment) {
    const title = 'BackEnd_WikiLanguage.cancelNonCashPaymentTitle';
    const confirmed = await this.modalService.openConfirm(title, 'BackEnd_WikiLanguage.cancelNonCashPaymentWarning', {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Delete'
    });

    if (confirmed) {
      await this.confirmDeletePayment(item);
      this.refresh.emit();
    }
  }

  @Loading(LoaderType.MANAGE_INVOICE)
  async confirmDeletePayment(item: Payment) {
    await this.apiClient.deleteInvoicePayment(inverseReducePayment(item)).toPromise();
  }

  @Loading(LoaderType.MANAGE_INVOICE)
  async cancelPayment(item: Payment) {
    await this.apiClient.cancelInvoicePayment(inverseReducePayment(item)).toPromise();
    this.refresh.emit();
  }

  async sendReceipt(item: Payment): Promise<void> {
    await sendReceipt(item, this.invoice, this.modalService);
    this.refresh.emit();
  }

  printReceipt(item: Payment): void {
    printReceipt(item.id, item.isBookingPrepayment ? 'on' : 'off', this.apiClient, this.modalService);
  }
  ngOnDestroy() {}
}
