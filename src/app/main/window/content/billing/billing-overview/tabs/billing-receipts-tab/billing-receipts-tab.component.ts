import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ViewService } from '@/app/main/view/view.service';
import { openAddGuestPayments } from '@/app/main/window/content/billing/add-guest-payments/open-add-guest-payments';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { printReceipt } from '../billing-invoices-tab/manage-invoice/payments/print-receipt';
import { sendReceipt } from '../billing-invoices-tab/manage-invoice/payments/send-receipt';

@Component({
  selector: 'app-billing-receipts-tab',
  templateUrl: '../../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../../../shared/window-iframe/window-iframe.component.sass']
})
export class BillingReceiptsTabComponent extends WindowIframeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private viewService: ViewService,
    private apiClient: ApiClient,
    private modalService: ModalService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  onMessage(event: MessageEvent): void {
    const message = event.data;
    if (!message) {
      return;
    }
    if (message.functionName === 'bwMessage' && typeof message.data === 'object') {
      switch (message.data.action) {
        case 'openGuestPayments':
        case 'openGuestPaymentsForAmendment':
          openAddGuestPayments(
            this.viewService,
            {
              openCashRegister: true,
              amendmentMode: message.data.action === 'openGuestPaymentsForAmendment'
            });
          break;
        case 'printReceipt':
          printReceipt(+message.data.rcId, 'RECEIPT', this.apiClient, this.modalService);
          break;
        case 'sendReceipt':
          this.apiClient.sendPaymentConfirmationFromReceipt(+message.data.rcId, message.data.email).toPromise();
          break;
      }
    }
  }

  ngOnInit() {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();

    this.loadIframe('/easybookingConfig', { cid, lid }, '#iframe/cashReceiptReport');
  }
}
