import { Component, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';
import { PrintPaymentCashResponse } from '../models';

@Component({
  selector: 'app-print-payment-iframe',
  templateUrl: '../../../../../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: [
    '../../../../../../../../shared/window-iframe/window-iframe.component.sass',
    './print-payment-iframe.component.sass'
  ]
})
export class PrintPaymentIframeComponent extends WindowIframeComponent {

  close = new EventEmitter();

  constructor(
    private authService: AuthService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  init(response: PrintPaymentCashResponse) {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();
    const params = { cid, lid, rc_id: response.id };

    this.loadIframe('/easybookingConfig', params, '#iframe/receiptPrintingFormat');
  }

  onMessage(e: MessageEvent) {
    if (e.data.data.action === 'close') {
      this.close.emit();
    }
  }
}
