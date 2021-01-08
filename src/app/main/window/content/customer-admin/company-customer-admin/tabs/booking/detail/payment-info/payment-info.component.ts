import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { CacheService } from '@/app/helpers/cache.service';
import { WindowIframeComponent } from '@/app/main/window/shared/window-iframe/window-iframe.component';
import { LoaderService } from '@/app/shared/loader.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: '../../../../../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: [
    '../../../../../../../shared/window-iframe/window-iframe.component.sass',
    './payment-info.component.sass'
  ]
})
export class PaymentInfoComponent extends WindowIframeComponent implements OnInit {

  @Input() cardURI!: string;

  constructor(
    sanitizer: DomSanitizer,
    loaderService: LoaderService,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  ngOnInit() {
    if (!this.cardURI) { throw new Error('cardURI required'); }

    const params = { card_URI: this.cardURI };

    this.loadIframe('/Property/Zadego_Live/PaymentInfo', params, '', 'https://users.pcibooking.net');
  }
}
