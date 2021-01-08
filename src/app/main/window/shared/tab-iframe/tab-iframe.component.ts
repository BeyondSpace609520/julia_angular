import { ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { LoaderService } from '@/app/shared/loader.service';

export abstract class TabIframeComponent {

  static readonly loaderId = 'IframeLoading';
  isLoading: Observable<boolean>;
  url: SafeResourceUrl;

  @ViewChild('iframe', {static: false}) iframe: ElementRef<any>;

  protected constructor(
    public loaderService: LoaderService,
    private sanitizer: DomSanitizer,
  ) {
    this.isLoading = loaderService.isLoading(TabIframeComponent.loaderId);
  }

  loadIframe(url: string): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.loaderService.show(TabIframeComponent.loaderId);
  }

  onLoad(): void {
    this.loaderService.hide(TabIframeComponent.loaderId);
  }

}
