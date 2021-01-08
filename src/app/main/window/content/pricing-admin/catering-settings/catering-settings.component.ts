import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-catering-settings',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class CateringSettingsComponent extends WindowIframeComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private authService: AuthService,
    private eventBusService: EventBusService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  onMessage(event: MessageEvent): void {
    if (event.data.functionName === 'cateringSettingsMessage' && event.data.data === 'reloadCompanyDetails') {
      sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
      this.eventBusService.emit('reloadCompanyDetails');
    }
  }

  ngOnInit(): void {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();

    this.loadIframe('/easybookingConfig', { cid, lid }, '#iframe/cateringSettings');
  }

  ngOnChanges({top}: SimpleChanges): void {
    if (top && top.previousValue && !top.currentValue) {
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    }
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
  }
}
