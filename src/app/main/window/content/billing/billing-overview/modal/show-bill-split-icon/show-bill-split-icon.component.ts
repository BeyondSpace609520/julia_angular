import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

@Component({
  selector: 'app-show-bill-split-icon',
  templateUrl: './show-bill-split-icon.component.pug',
  styleUrls: ['./show-bill-split-icon.component.sass']
})
export class ShowBillSplitIconComponent extends WindowIframeComponent implements OnDestroy {


  private params;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private eventBusService: EventBusService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  public init(billId: number) {
    const {customerId: hotelId, languageId: language} = this.authService.getQueryParams();
    const token = 'useC';
    this.params = {hotelId, language, token};
    this.loadIframe(`/easybookingBackend/${hotelId}/${language}/billsplit/0/${billId}`, this.params);
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'billSplitDone');
  }
}
