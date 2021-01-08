import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

@Component({
  selector: 'app-report-and-list',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class ReportAndListComponent extends WindowIframeComponent implements OnInit {

  @Input() jumpToPrepayments?: boolean;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit() {
    const {customerId: hotelId, languageId: language} = this.authService.getQueryParams();
    const { dbName } = this.mainService.getCompanyDetails();
    const params = {cid: hotelId, lid: language, dbName, messagecenterJumpPrepayment: this.jumpToPrepayments ? 1 : 0};

    this.loadIframe('/easybookingConfig', params, '#iframe/reports');

  }

}
