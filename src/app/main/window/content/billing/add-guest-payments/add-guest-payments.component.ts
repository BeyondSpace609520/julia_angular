import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { getUrlFromPath } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderType } from '../../../shared/window-iframe/loader-types';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import {
  printReceipt
} from '../billing-overview/tabs/billing-invoices-tab/manage-invoice/payments/print-receipt';

@Component({
  selector: 'app-add-guest-payments',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class AddGuestPaymentsComponent extends WindowIframeComponent implements OnInit {
  @Input() bookingNo = '';
  @Input() openCashRegister = false;
  @Input() amendmentMode = false;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private apiClient: ApiClient,
    private modalService: ModalService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  onMessage(message: MessageEvent): void {
    if (!message.data || message.data.functionName !== 'agpMessage') {
      return;
    }
    switch (message.data.data.action) {
      case 'printReceipt':
        const id = +message.data.data.rcId;
        printReceipt(id, 'RECEIPT', this.apiClient, this.modalService);
        break;
      case 'openBill':
        this.generatePDF(+message.data.data.billId, +message.data.data.bookingId).catch();
        break;
    }
  }

  @Loading(LoaderType.Download)
  public async generatePDF(billId: number, bookingId: number): Promise<void> {
    const url = await this.apiClient
      .generateBillPDF(billId, bookingId)
      .toPromise();

    window.open(getUrlFromPath(url), '_blank');
  }

  ngOnInit() {
    const {customerId: hotelId, languageId: language} = this.authService.getQueryParams();
    const { dbName } = this.mainService.getCompanyDetails();
    const params = {
      cid: hotelId,
      lid: language,
      dbName,
      jumpToTabCashRegister: !this.openCashRegister ? 0 : 1,
      amendmentMode: !this.amendmentMode ? 0 : 1,
      jumpToBookingNumber: this.bookingNo
    };

    this.loadIframe('/easybookingConfig/', params, '#iframe/guestPayments');
  }
}
