import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { UserService } from '@/app/auth/user.service';
import { LanguageService } from '@/app/i18n/language.service';
import { TabIframeComponent } from '@/app/main/window/shared/tab-iframe/tab-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-statistics',
  templateUrl: '../../../../../shared/tab-iframe/tab-iframe.component.pug',
  styleUrls: ['../../../../../shared/tab-iframe/tab-iframe.component.sass']
})
export class StatisticsComponent extends TabIframeComponent {

  url: SafeResourceUrl;

  constructor(
    loaderService: LoaderService,
    domSanitizer: DomSanitizer,
    private userService: UserService,
    private languageService: LanguageService,
  ) {
    super(loaderService, domSanitizer);
    const customerId = this.userService.hotelId;
    const languageId = this.languageService.getLanguageId();
    this.loadIframe(`${environment.legacyContentUrl}/easybookingConfig/?cid=${customerId}&lid=${languageId}#iframe/enquiryPoolStatistics`);
  }

}
