import { EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

export class SaveProductComponent extends WindowIframeComponent {

  close = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  loadProductIframe(params: {[key: string]: any}) {
    const { customerId, languageId } = this.authService.getQueryParams();

    this.loadIframe('/easybookingConfig/', { cid: customerId, lid: languageId,  ...params }, '#iframe/productManagementAddProduct');
  }

  onMessage(e: MessageEvent) {
    switch (e.data.data) {
      case 'cancel': return this.close.next(false);
      case 'ok': return this.close.next(true);
    }
  }
}
