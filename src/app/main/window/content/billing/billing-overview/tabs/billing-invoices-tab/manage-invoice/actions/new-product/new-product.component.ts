import dayjs from 'dayjs';

import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { LoaderService } from '@/app/shared/loader.service';
import { BillingInvoice } from '../../../models';
import { Invoice } from '../../models';
import { SaveProductComponent } from '../../shared/save-product/save-product.component';

@Component({
  selector: 'app-new-product',
  templateUrl: '../../../../../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: [
    '../../../../../../../../shared/window-iframe/window-iframe.component.sass',
    '../../shared/save-product/save-product.component.sass'
  ]
})
export class NewProductComponent extends SaveProductComponent {

  constructor(
    authService: AuthService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(authService, sanitizer, loaderService, cacheService);
  }

  init(invoice: Invoice, billing: BillingInvoice) {
    const params = {
      bookingId: invoice.bookingId,
      billVersionId: invoice.billingVersionId,
      minArrival: dayjs(billing === null ? new Date() : billing.billFromDateUK).format('YYYY-MM-DD'),
    };
    super.loadProductIframe(params);
  }
}
