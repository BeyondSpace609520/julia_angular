import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: '../../../../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: [
    '../../../../../../../shared/window-iframe/window-iframe.component.sass',
    './advertisement.component.sass'
  ]
})
export class AdvertisementComponent extends WindowIframeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit() {
    const { languageId: language } = this.authService.getQueryParams();
    const params = { lid: language };

    this.loadIframe('/wo/Services/com/advertisementScreens/pciModuleNotActive.php', params);
  }
}
