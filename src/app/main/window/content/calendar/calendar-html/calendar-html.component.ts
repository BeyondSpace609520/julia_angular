import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { ViewService } from '@/app/main/view/view.service';
import { openAddGuestPayments } from '@/app/main/window/content/billing/add-guest-payments/open-add-guest-payments';
import { openBillingOverview } from '@/app/main/window/content/billing/billing-overview/open-billing-overwiew';
import { openCalendarSettings } from '@/app/main/window/content/calendar/calendar-settings/open-calendar-settings';
import { openCompanyCustomerAdmin } from '@/app/main/window/content/customer-admin/company-customer-admin/open-company-customer-admin';
import { openGeneralSettings } from '@/app/main/window/content/customer-admin/general-settings/open-general-settings';
import { openGuestRegistration } from '@/app/main/window/content/customer-admin/guest-registration/open-guest-registration';
import { openSupportForm } from '@/app/main/window/content/my-eb/support-form-new/open-support-form';
import { openVisitorsTaxSettings } from '@/app/main/window/content/pricing-admin/visitors-tax-settings/open-visitors-tax-settings';
import { openRoomCategory } from '@/app/main/window/content/room-admin/room-category/open-room-category';
import { openRoomsApartments } from '@/app/main/window/content/room-admin/rooms-apartments/open-rooms-apartments';
import { openSpecialOffers } from '@/app/main/window/content/services/special-offers/open-special-offers';
import { openBookingTools } from '@/app/main/window/content/web-tools/booking-tools/open-booking-tools';
import { LoaderType } from '@/app/main/window/shared/window-iframe/loader-types';
import { getUrlFromPath } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { EventBusService } from '../../../shared/event-bus';
import { WindowIframeComponent } from '../../../shared/window-iframe/window-iframe.component';
import { MoveToRoomplanEvent, SendToRoomplanEvent, ShowRoomplanMessageEvent,
  StartLoadingAnimationRoomplanEvent, UpdateRoomplanEvent } from './events';

@Component({
  selector: 'app-calendar-html',
  templateUrl: '../../../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../../../shared/window-iframe/window-iframe.component.sass']
})
export class CalendarHTMLComponent extends WindowIframeComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private eventBusService: EventBusService,
    private viewService: ViewService,
    private apiClient: ApiClient,
    loaderService: LoaderService,
    sanitizer: DomSanitizer,
    cacheService: CacheService,
  ) {
    super(loaderService, sanitizer, cacheService);

    this.setupEventBusListeners();
  }

  onMessage(event: MessageEvent): void {
    const message = event.data;
    if (!message) {
      return;
    }
    if (message.functionName === 'ngRoomplanMessage' && typeof message.data === 'object') {
      switch (message.data.action) {
        case 'setIframeId':
          this.sendRoomplanMessage(
            'juliaVersion',
            this.mainService.currentVersion ? this.mainService.currentVersion.version : ''
          );
          break;
        case 'openBillingWorkbench':
          openBillingOverview(
            this.viewService,
            {
              range: {
                start: new Date(message.data.fromDate),
                end: new Date(message.data.untilDate)
              },
              bookingNumber: message.data.b_bookingNo,
              openManageInvoiceModal: true
            }
          );
          break;
        case 'openSaraAppSettings':
          openBookingTools(this.viewService, {tabNumber: 9});
          break;
        case 'openGuestAdmin':
          openCompanyCustomerAdmin(this.viewService, {customerId: +message.data.customer_id});
          break;
        case 'openGuestRegistration':
          openGuestRegistration(
            this.viewService,
            {
              range: {
                start: new Date(message.data.fromDate),
                end: new Date(message.data.untilDate)
              },
              lastName: message.data.lastName
            }
          );
          break;
        case 'offerPDF':
          this.generateAndOpenOfferPdf(message.data.booking_id);
          break;
        case 'eventsPDF':
          this.generateAndOpenEventsPdf(message.data.booking_id);
          break;
        case 'invoicePDF':
          this.generateAndOpenInvoicePdf(message.data.booking_id);
          break;
        case 'openPaymentsScreen':
          openAddGuestPayments(this.viewService, {bookingNo: message.data.b_bookingNo});
          break;
        case 'openPricing':
          openRoomCategory(this.viewService, {preselectRoomId: message.data.e_id});
          break;
        case 'openVTAdmin':
          openVisitorsTaxSettings(this.viewService);
          break;
        case 'openEBAdmin':
          openSupportForm(this.viewService);
          break;
        case 'openSourceAdmin':
          openGeneralSettings(this.viewService, {preselectTabId: 'sources'});
          break;
        case 'openColorAdmin':
          openCalendarSettings(this.viewService);
          break;
        case 'openRoomAdmin':
          openRoomsApartments(this.viewService, {
            preselectRoomId: message.data.e_id,
            preselectTabId: message.data.tabname
          });
          break;
        case 'openCategoryAdmin':
          if (message.data.tabname === 'images') {
            message.data.tabname = 'pictures';
          }
          openRoomCategory(this.viewService, {
            preselectRoomCategoryId: message.data.eg_id,
            preselectTabId: message.data.tabname
          });
          break;
        case 'openSpecialOffer':
          openSpecialOffers(this.viewService);
          break;
      }
    }
  }

  private sendRoomplanMessage(method: string, data: any): void {
    this.sendMessage({
      type: 'customReceiveMessage',
      module: 'ngRoomplan',
      method,
      data
    });
  }

  private setupEventBusListeners(): void {
    this.eventBusService.on<UpdateRoomplanEvent>('updateRoomplanWindows').pipe(untilDestroyed(this)).subscribe(() => {
      this.sendRoomplanMessage('refreshBookingSources', { status: 'refreshBookingSources' });
    });
    this.eventBusService.on<MoveToRoomplanEvent>('moveToRoomplan').pipe(untilDestroyed(this)).subscribe(data => {
      this.sendRoomplanMessage('movetoAndOpenBooking', {
        arrivalDate: data.arrivalDate.getTime(),
        b_id: data.id,
        type: data.type
      });
    });
    this.eventBusService
      .on<StartLoadingAnimationRoomplanEvent>('startLoadingAnimationRoomplan')
      .pipe(untilDestroyed(this)).subscribe(() => {
        this.sendRoomplanMessage('startLoadingAnimation', null);
      })
    ;
    this.eventBusService.on<ShowRoomplanMessageEvent>('showRoomplanMessage').pipe(untilDestroyed(this)).subscribe(message => {
      this.sendRoomplanMessage('showStandardMessage', { msg: message });
    });
    this.eventBusService.on<SendToRoomplanEvent>('sendToRoomplan').pipe(untilDestroyed(this)).subscribe(payload => {
      this.sendRoomplanMessage(payload.method, payload.object);
    });
  }

  @Loading(LoaderType.Download)
  private async generateAndOpenOfferPdf(bookingId: number): Promise<void> {
    const { dbName } = this.mainService.getCompanyDetails();
    const pdfUrl = await this.apiClient.getBookingPdf(bookingId, dbName).toPromise();
    window.open(getUrlFromPath(pdfUrl), '_blank');
  }

  @Loading(LoaderType.Download)
  private async generateAndOpenEventsPdf(bookingId: number): Promise<void> {
    const { dbName } = this.mainService.getCompanyDetails();
    const pdfUrl = await this.apiClient.getEventsPdf(bookingId, dbName).toPromise();
    window.open(getUrlFromPath(pdfUrl), '_blank');
  }

  @Loading(LoaderType.Download)
  private async generateAndOpenInvoicePdf(bookingId: number): Promise<void> {
    const pdfUrl = await this.apiClient.generateBillPDF(null, bookingId).toPromise();
    window.open(getUrlFromPath(pdfUrl), '_blank');
  }

  ngOnInit(): void {
    const { customerId: hotelId, languageId: language } = this.authService.getQueryParams();
    const { versionNo } =  this.mainService.getCompanyDetails();
    const params = { hotelId, language, v: versionNo, token: 'useC' };

    this.loadIframe(environment.calendarUrl, params);
  }

  ngOnDestroy() {}
}
