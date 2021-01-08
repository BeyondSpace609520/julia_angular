import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-room-owner',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class RoomOwnerComponent extends WindowIframeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit(): void {
    const { customerId, languageId } = this.authService.getQueryParams();
    this.loadIframe('/easybookingConfig', { cid: customerId, lid: languageId }, '#iframe/roomOwner');
  }
}
