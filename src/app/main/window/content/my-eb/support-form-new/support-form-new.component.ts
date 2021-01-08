import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-support-form-new',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class SupportFormNewComponent extends WindowIframeComponent implements OnInit {

  @Input() caseId?: number;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit() {
    const { customerId: cid, languageId: lid } = this.authService.getQueryParams();
    const companyDetails = this.mainService.getCompanyDetails();
    const dbName = companyDetails.dbName;
    const username = companyDetails.username;  // DONE - get username was empty?
    const prefillSupportAreaAndTopic = '';
    const backendVersion = this.mainService.currentVersion !== undefined ? this.mainService
      .currentVersion.version : '';
    const juliaVersion = 'html';

    const params: {[k: string]: string | number} = {
      cid,
      lid,
      username,
      dbName,
      juliaVersion,
      backendVersion,
      prefillSupportAreaAndTopic,
    };

    if (this.caseId) {
      params.jumpToCasenumber = this.caseId;
    }

    this.loadIframe('/easybookingConfig', params, '#iframe/supportFormNeu');
  }
}
