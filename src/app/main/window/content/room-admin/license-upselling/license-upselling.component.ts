import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { ViewService } from '@/app/main/view/view.service';
import { openSupportForm } from '@/app/main/window/content/my-eb/support-form-new/open-support-form';
import { Window } from '@/app/main/window/models';
import { WindowsService } from '@/app/main/window/windows.service';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-license-upselling',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass'],
})
export class LicenseUpsellingComponent
  extends WindowIframeComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() window: Window;

  constructor(
    private authService: AuthService,
    private viewService: ViewService,
    private windowsService: WindowsService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit(): void {
    const {
      customerId: cid,
      languageId: lid,
    } = this.authService.getQueryParams();

    this.loadIframe(
      '/easybookingConfig',
      { cid, lid },
      '#iframe/licenceUpsellingModal'
    );
  }

  ngOnChanges({ top }: SimpleChanges): void {}

  ngOnDestroy(): void {}

  onMessage(event: MessageEvent): void {
    const message = event.data;
    if (!message) {
      return;
    }
    if (
      message.functionName === 'roomLicensingMessage' &&
      typeof message.data === 'object'
    ) {
      switch (message.data.action) {
        case 'openMyEb':
          openSupportForm(this.viewService);
          break;
        case 'close':
          this.windowsService.closeWindow(this.window);
          break;
      }
    }
  }
}
