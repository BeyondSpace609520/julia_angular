import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-advertisement',
  templateUrl: '../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../../shared/window-iframe/window-iframe.component.sass']
})
export class AdvertisementComponent extends WindowIframeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit() {
    const { languageId: lid } = this.authService.getQueryParams();

    this.loadIframe('/wo/Services/com/advertisementScreens/ervNotActive.php', {
      video: 'category/europaeische-reiseversicherung',
      lid
    }, '#iframe/guestMap');
  }
}
