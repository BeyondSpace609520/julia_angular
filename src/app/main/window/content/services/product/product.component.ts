import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

@Component({
  selector: 'app-product',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class ProductComponent extends WindowIframeComponent implements OnInit, OnChanges, OnDestroy {

  @Input() top: boolean;

  constructor(
    private authService: AuthService,
    private eventBusService: EventBusService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit(): void {
    const {customerId: hotelId, languageId: language} = this.authService.getQueryParams();
    const params = {cid: hotelId, lid: language};

    this.loadIframe('/easybookingConfig', params, '#iframe/productManagement');

  }

  ngOnChanges({top}: SimpleChanges): void {
    if (top && top.previousValue && !top.currentValue) {
      sendRoomplanUpdate(this.eventBusService, 'productAdminChanged');
    }
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'productAdminChanged');
  }

}
