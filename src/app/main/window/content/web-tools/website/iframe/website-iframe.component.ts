import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-website-iframe',
  templateUrl: '../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../../shared/window-iframe/window-iframe.component.sass']
})
export class WebsiteIframeComponent extends WindowIframeComponent implements OnInit {

  @Output() cancel = new EventEmitter();

  constructor(
    private authService: AuthService,
    private apiClient: ApiClient,
    private mainService: MainService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);

    (window.top as any).TYPO3 = {}; // https://trello.com/c/tLTYotvd/217-web-tools-website#comment-5e5e33d8511573015c1adb0a
  }

  async ngOnInit() {
    const { languageId: lid } = this.authService.getQueryParams();
    const company = this.mainService.getCompanyDetails();
    const iframeType = await this.apiClient.getCmsActive().toPromise();

    if (iframeType === 'on' || iframeType === 'flashCMS') {
      this.cancel.emit();
    } else if (iframeType === 't3006') {
      this.loadIframe('/wartung/typo3conf/ext/webx_multisite_login/Start/index.php', {
        secure: company.c_websitePass,
        admin: company.au_isAdmin === 'on' ? 'true' : ''
      });
    } else if (iframeType === 'htmlCMS') {
      this.loadIframe('/typo3conf/ext/wc_multisite_cp/MainApplication/admin.php', {
        user: company.c_websiteUser,
        pass: company.c_websitePass,
        page_id: company.c_websitePageId,
        admin: company.au_isAdmin === 'on' ? 'true' : ''
      }, '', '//admintool.easy-booking.at');
    } else {
      this.loadIframe('/wo/Services/com/advertisementScreens/websiteNotActive.php', { lid });
    }
  }
}
