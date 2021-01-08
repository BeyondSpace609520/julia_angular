import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { ApiBillingWorkbenchService } from '@/app/helpers/api/api-billing-workbench.service';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

@Component({
  selector: 'app-billing-settings',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class SettingsComponent extends WindowIframeComponent implements OnInit, OnChanges, OnDestroy {

  @Input() top: boolean;

  private params;
  private lastCleanupChargeSeparateSetting?: boolean;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private apiBillingWorkbenchService: ApiBillingWorkbenchService,
    private eventBusService: EventBusService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  private async compareLastCleanupChargeSeparateSetting(): Promise<void> {
    const currentSetting = await this.apiBillingWorkbenchService.getCleanupChargeSeparateSetting().toPromise();
    if (this.lastCleanupChargeSeparateSetting !== undefined && this.lastCleanupChargeSeparateSetting !== currentSetting) {
      sendRoomplanUpdate(this.eventBusService, 'cleanupChargeSeparateChanged');
      sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
    }
    this.lastCleanupChargeSeparateSetting = currentSetting;
  }

  ngOnInit(): void {
    const { customerId: hotelId, languageId: language } = this.authService.getQueryParams();
    const { dbName } = this.mainService.getCompanyDetails();

    this.params = { cid: hotelId, lid: language, dbName };
    this.compareLastCleanupChargeSeparateSetting();
    // /easybookingConfig/?cid=8058&lid=2&dbName=srv0018058#iframe/invoiceSettings
    this.loadIframe('/easybookingConfig/', this.params, '#iframe/invoiceSettings');
  }

  ngOnChanges({top}: SimpleChanges): void {
    if (top && top.previousValue !== false && top.currentValue === false) {
      this.compareLastCleanupChargeSeparateSetting();
    }
  }

  ngOnDestroy(): void {
    this.compareLastCleanupChargeSeparateSetting();
  }
}
