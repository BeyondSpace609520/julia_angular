import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';
import { LoaderType } from './loader-types';

@Component({
  selector: 'app-operation-settings',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class OperationSettingsComponent extends WindowIframeComponent implements OnInit, OnDestroy {

  @Input() tab?: string;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private eventBusService: EventBusService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    protected cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  async loadIframe(): Promise<void> {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();
    const { dbName } = await this.cacheService.getCompanyDetails();

    const params: {[key: string]: string | number} = {
      cid,
      lid,
      jumpToEmailtab: 0,
      dbName
    };
    switch (this.tab) {
      case 'email':
        params.jumpToEmailtab = 1;
        break;
    }

    super.loadIframe('/easybookingConfig', params, '#iframe/hotelManagement/newRoomplan');
  }

  @Loading(LoaderType.IFRAME)
  async onMessage(e: MessageEvent): Promise<void> {
    if (e.data.data && e.data.data.action === 'save') {
      await this.mainService.updateCompanyDetails();
      this.loadIframe();
    }
  }

  ngOnInit(): void {
    this.loadIframe();
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
  }
}
