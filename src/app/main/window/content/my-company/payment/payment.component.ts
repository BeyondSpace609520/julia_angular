import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-payment',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class PaymentComponent extends WindowIframeComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private eventBusService: EventBusService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit(): void {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();

    this.loadIframe('/easybookingConfig', { cid, lid }, '#iframe/payment');
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
  }
}
