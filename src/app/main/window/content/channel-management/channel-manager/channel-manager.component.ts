import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { LoaderType } from '@/app/main/window/shared/window-iframe/loader-types';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';

@Component({
  selector: 'app-channel-manager',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class ChannelManagerComponent  extends WindowIframeComponent implements OnInit {
  @Input() directConnect = false;

  constructor(
    private apiClient: ApiClient,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);
  }

  @Loading(LoaderType.Iframe)
  private async init(): Promise<void> {
    const { iframe_url } = await this.apiClient.getBookingSources().toPromise();
    this.loadIframe(iframe_url, {}, '', '');
  }

  @Loading(LoaderType.Iframe)
  private async openDirectConnect(): Promise<void> {
    const directConnect_url = await this.apiClient.getCMDirectConnectLink().toPromise();
    this.loadIframe(directConnect_url[0], {}, '', '');
  }

  ngOnInit(): void {
    if (this.directConnect) {
      this.openDirectConnect();
    } else {
      this.init();
    }
  }
}
