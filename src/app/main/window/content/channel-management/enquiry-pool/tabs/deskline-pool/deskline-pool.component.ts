import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { UserService } from '@/app/auth/user.service';
import { ApiClient } from '@/app/helpers/api-client';
import { ApiEnquiryPoolService } from '@/app/helpers/api/api-enquiry-pool.service';
import { LanguageService } from '@/app/i18n/language.service';
import { ViewService } from '@/app/main/view/view.service';
import { assignEnquiry, openFeratelEnquiry } from '@/app/main/window/content/channel-management/enquiry-pool/functions';
import { FeratelEnquiry, RawFeratelEnquiry } from '@/app/main/window/content/channel-management/enquiry-pool/models';
import { reduceFeratelEnquiry } from '@/app/main/window/content/channel-management/enquiry-pool/reduce';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { TabIframeComponent } from '@/app/main/window/shared/tab-iframe/tab-iframe.component';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';

const pollIterationLimit = 100;
const pollIterationTimeout = 1;

@Component({
  selector: 'app-deskline-pool',
  templateUrl: '../../../../../shared/tab-iframe/tab-iframe.component.pug',
  styleUrls: ['../../../../../shared/tab-iframe/tab-iframe.component.sass']
})
export class DesklinePoolComponent extends TabIframeComponent {

  @Output() deactivate: EventEmitter<void> = new EventEmitter();

  private maxId: number;

  @HostListener('window:message', ['$event']) onMessage(message: MessageEvent): void {
    if (!message || !message.data || message.data.functionName !== 'fepMessage' || !message.data.data) {
      return;
    }
    switch (message.data.data.action) {
      case 'startPolling':
        this.startPolling();
        break;
      case 'consentRevoked':
        this.deactivate.emit();
        break;
    }
  }

  constructor(
    loaderService: LoaderService,
    domSanitizer: DomSanitizer,
    private userService: UserService,
    private languageService: LanguageService,
    private apiEnquiryPoolService: ApiEnquiryPoolService,
    private apiClient: ApiClient,
    private viewService: ViewService,
    private eventBusService: EventBusService,
    private translateService: TranslateService,
  ) {
    super(loaderService, domSanitizer);
    this.init();
  }

  @Loading(TabIframeComponent.loaderId)
  private async init(): Promise<void> {
    this.maxId = await this.apiEnquiryPoolService.getEnquiryPoolMaxId().toPromise();
    const customerId = this.userService.hotelId;
    const languageId = this.languageService.getLanguageId();
    this.loadIframe(`${environment.legacyContentUrl}/easybookingConfig/?cid=${customerId}&lid=${languageId}#iframe/feratelEnquiryPool`);
  }

  private async poll(iteration: number): Promise<FeratelEnquiry | null> {
    if (iteration === pollIterationLimit) {
      return null;
    }
    const result: RawFeratelEnquiry | null = await this.apiEnquiryPoolService.pollForFeratelDesklineEnquiry(this.maxId).toPromise();
    if (result === null) {
      await new Promise(resolve => setTimeout(resolve, pollIterationTimeout * 1000));
      return await this.poll(iteration + 1);
    }
    return reduceFeratelEnquiry(result);
  }

  private async startPolling(): Promise<void> {
    const enquiry = await this.poll(0);
    this.hideIframeSpinner();
    if (enquiry === null) {
      return;
    }
    switch (enquiry.status) {
      case 'automatic':
        openFeratelEnquiry(enquiry, this.viewService, this.eventBusService);
        break;
      case 'openEnquiry':
        assignEnquiry(enquiry, this.viewService, this.apiClient, this.eventBusService, this.translateService);
        break;
    }
  }

  private hideIframeSpinner(): void {
    const iframeElement = this.iframe.nativeElement;
    if (iframeElement) {
      try {
        (iframeElement.contentWindow as any).utils.spinner.hide();
      } catch (error) {
        console.warn(error);
      }
    }
  }
}
