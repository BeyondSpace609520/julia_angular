import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { UserService } from '@/app/auth/user.service';
import { CacheService } from '@/app/helpers/cache.service';
import { LanguageService } from '@/app/i18n/language.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

@Component({
  selector: 'app-message-center',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class MessageCenterComponent extends WindowIframeComponent implements OnInit {

  constructor(
    private userService: UserService,
    private languageService: LanguageService,
    protected cacheService: CacheService,
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  private async init(): Promise<void> {
    const cid = this.userService.hotelId;
    const lid = this.languageService.getLanguageId();
    const {dbName} = await this.cacheService.getCompanyDetails();

    if (!cid || !dbName) {
      console.error('CID: ', cid, 'or dbName:', dbName, 'is empty');
      return;
    }

    this.loadIframe('/easybookingConfig', {cid, lid, dbName}, '#iframe/adminMessageCenter');
  }

  ngOnInit(): void {
    this.init();
  }
}
