import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { LoaderService } from '@/app/shared/loader.service';
import { IframeUrlParams, WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-booking-tools',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class BookingToolsComponent extends WindowIframeComponent implements OnInit, OnDestroy {

  @Input() tabNumber?: number;

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

    const parameters: IframeUrlParams = { cid, lid };
    if (this.tabNumber) {
      parameters.jumpToBookingToolsTab = this.tabNumber;
    }

    this.loadIframe('/easybookingConfig', parameters, '#iframe/bookingTools');
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
  }
}
