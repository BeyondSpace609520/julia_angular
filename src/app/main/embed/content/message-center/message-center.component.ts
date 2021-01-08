import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { subDays } from 'date-fns';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { PeriodicCheckService } from '@/app/helpers/periodic-check.service';
import { ViewService } from '@/app/main/view/view.service';
import { openBillingOverview } from '@/app/main/window/content/billing/billing-overview/open-billing-overwiew';
import { openReportAndList } from '@/app/main/window/content/billing/report-and-list/open-report-and-list';
import { MoveToRoomplanEvent } from '@/app/main/window/content/calendar/calendar-html/events';
import { openEnquiryPool } from '@/app/main/window/content/channel-management/enquiry-pool/open-enquiry-pool';
import { openCompanyCustomerAdmin } from '@/app/main/window/content/customer-admin/company-customer-admin/open-company-customer-admin';
import { openGeneralSettings } from '@/app/main/window/content/customer-admin/general-settings/open-general-settings';
import { ViewMode } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { openGuestRegistration } from '@/app/main/window/content/customer-admin/guest-registration/open-guest-registration';
import { openOperationSettings } from '@/app/main/window/content/my-company/operation-settings/open-operation-settings';
import { openSupportForm } from '@/app/main/window/content/my-eb/support-form-new/open-support-form';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.pug',
  styleUrls: ['./message-center.component.sass'],
})
export class MessageCenterComponent implements OnInit {
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  @Input() visible!: boolean;
  @Output() hide = new EventEmitter();
  src: SafeResourceUrl | null = null;

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private viewService: ViewService,
    private eventBusService: EventBusService,
    private cacheService: CacheService,
    private periodicCheckService: PeriodicCheckService,
  ) {
    this.periodicCheckService.checkIfThereAreNewMessages();
  }

  ngOnInit() {
    const {
      customerId: cid,
      languageId: lid,
    } = this.authService.getQueryParams();

    // TODO - add query part: dbName=srv0010002&
    const path = `/easybookingConfig/?cid=${cid}&lid=${lid}&messagecenterJumpPrepayment=0#iframe/messageCenter`;
    const src = environment.legacyContentUrl + path;

    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  @HostListener('window:message', ['$event'])
  listenMessageEvent(e: MessageEvent): void {
    this.onMessage(e);
  }

  onMessage(message: MessageEvent): void {
    if (!message || !message.data || message.data.functionName !== 'mcMessage' || !message.data.data) {
      return;
    }
    switch (message.data.data.messageAction) {
      case 'confirm':
      case 'createBooking':
      case 'createChannelBooking':
      case 'feratelError':
      case 'updateChannelBooking':
      case 'updateSelfAdmin':
        this.openBooking(+message.data.data.id, message.data.data.fromDate, 'booking');
        break;
      case 'createEnquiry':
        this.openBooking(+message.data.data.id, message.data.data.fromDate, 'enquiry');
        break;
      case 'updateGuestData':
      case 'updateBirthday':
      case 'guestRating':
        openCompanyCustomerAdmin(this.viewService, {customerId: +message.data.data.id});
        break;
      case 'missingArrival':
        this.openMissingArrival();
        break;
      case 'missingDeparture':
        openGuestRegistration(this.viewService, {activeTabId: ViewMode.ARRIVED});
        break;
      case 'regFormNoRange80PercUsed':
        this.viewService.focusViewById('guestRegistrationConfig');
        break;
      case 'missingPrePayment':
        openReportAndList(this.viewService, {jumpToPrepayments: true});
        break;
      case 'unPaidInvoices':
        openBillingOverview(this.viewService, {type: 'bills'});
        break;
      case 'uncreatedInvoices':
        openBillingOverview(this.viewService);
        break;
      case 'openEnquiries':
        openEnquiryPool(this.viewService, {activeTabId: 'ebEnquiryPool'});
        break;
      case 'openDesklineEnquiries':
        this.cacheService.getCompanyDetails().then(companyDetails => {
          if (companyDetails.c_hasFeratelEnquiryPool === 'off') {
            return;
          }
          openEnquiryPool(this.viewService, {activeTabId: 'desklineEnquiryPool'});
        });
        break;
      case 'expiredReservations':
        this.viewService.focusViewById('channelStatistics');
        break;
      case 'supportCaseReplied':
      case 'supportCaseStateChanged':
      case 'supportNotificationB':
      case 'supportNotificationC':
        openSupportForm(this.viewService, {caseId: +message.data.data.id});
        break;
      case 'refreshMessageCounter':
        this.periodicCheckService.checkIfThereAreNewMessages();
        break;
      case 'openIframedHotelManagementEmailTab':
        openOperationSettings(this.viewService, {tab: 'email'});
        break;
      case 'openGuestAdminSettingsAtTabGDPR':
        openGeneralSettings(this.viewService, {preselectTabId: 'gdpr'});
        break;
      case 'newAirbnbEnquiry':
        const arrivalDate = new Date(message.data.data.arrivalDate);
        openEnquiryPool(this.viewService, {
          activeTabId: 'ebEnquiryPool',
          fromDate: arrivalDate,
          untilDate: arrivalDate
        });
        break;
    }
  }

  private async openBooking(bookingId: number, dateStr: string, type: string): Promise<void> {
    await this.viewService.focusViewById('calendarHTML');
    const arrivalDate = new Date();
    arrivalDate.setTime(Date.parse(dateStr));
    this.eventBusService.emit<MoveToRoomplanEvent>('moveToRoomplan', { arrivalDate, id: bookingId, type });
  }

  private openMissingArrival(): void {
    const start = subDays(new Date(), 30);
    const end = subDays(new Date(), 1);
    openGuestRegistration(this.viewService, {
      range: {start, end},
      status: 'notArrived'
    });
  }
}
