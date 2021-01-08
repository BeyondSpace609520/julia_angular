import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { LoaderService } from '@/app/shared/loader.service';
import { BillingInvoice } from '../../../../models';
import { Invoice, VersionDetail } from '../../../models';
import { SaveProductComponent } from '../../../shared/save-product/save-product.component';
import { ModalBody } from '../modal-body';

@Component({
  selector: 'app-edit-type3',
  templateUrl: '../../../../../../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: [
    '../../../../../../../../../shared/window-iframe/window-iframe.component.sass',
    '../../../shared/save-product/save-product.component.sass'
  ]
})
export class EditType3Component extends SaveProductComponent implements ModalBody {

  constructor(
    authService: AuthService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(authService, sanitizer, loaderService, cacheService);
  }

  public init(detail: VersionDetail, invoice: Invoice, billing?: BillingInvoice): void {
    const params = {
      bookingId: invoice.bookingId,
      billVersionId: invoice.billingVersionId,
      minArrival: billing ? billing.billFromDateUK : '',
      p1: detail.id
    };
    this.loadProductIframe(params);
  }

  public extractDetail(): null { return null; }

  public onSaveEdit(_: VersionDetail): void {}
}
