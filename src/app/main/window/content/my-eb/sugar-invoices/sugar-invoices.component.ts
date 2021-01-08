import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-sugar-invoices',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class SugarInvoicesComponent extends WindowIframeComponent implements OnInit {

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
    const dbName = this.mainService.getCompanyDetails().dbName;
    const username = '';

    this.loadIframe('/easybookingConfig', { cid, lid, dbName, username }, '#iframe/sugarInvoices');
  }
}
