import { openGuestInformation } from '@/app/main/window/content/customer-admin/guest-information/utils';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { ViewService } from '@/app/main/view/view.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../../loader-types';
import { CustomerBooking } from '../../../models';
import { BookingDetail, GuestRelatedDetail } from '../models';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './detail.component.pug',
  styleUrls: ['./detail.component.sass']
})
export class BookingDetailComponent implements OnChanges {

  @Input() item: CustomerBooking;

  details: BookingDetail;
  guestDetails: GuestRelatedDetail;

  get showEditButton() {
    const company = this.mainService.getCompanyDetails();

    return company.c_meldewesen !== 'off' || company.c_onlineCheckIn !== 'off';
  }

  get canEdit() {
    return this.details && !this.details.cancelled;
  }

  get isChannelManager() {
    return this.details && this.details.source.toLowerCase().startsWith('channelmanager');
  }

  get isDepositAmountShown() {
    return this.details && this.isChannelManager
      && this.details.sourcePlatform !== 'easybooking'
      && this.details.depositAmount > 0;
  }

  get hasCreditCardDetails() {
    return this.details && (!this.isChannelManager || this.details.sourcePlatform === 'easybooking')
      && this.details.paymentMethod === 'CreditCard'
      && this.details.creditCard && this.details.creditCard.token === null;
  }

  get hasCreditCardDetailsButton() {
    return this.details && this.details.creditCard && this.details.creditCard.token;
  }

  get isPrivacyPolicyShows() {
    return this.guestDetails.docs.length > 0 && this.guestDetails.agreedAt;
  }

  constructor(
    public loaderService: LoaderService,
    private mainService: MainService,
    private apiClient: ApiClient,
    private modal: ModalService,
    private viewService: ViewService,
  ) { }

  ngOnChanges({ item }: SimpleChanges) {
    if (item && item.currentValue !== item.previousValue) {
      this.load();
    }
  }

  @Loading(LoaderType.CUSTOMER_BOOKING)
  async load() {
    this.details = await this.apiClient.getBookingDetail(this.item.id).toPromise();
    this.guestDetails = await this.apiClient.getBookingGuestDetail(this.item.id).toPromise();
  }

  @Loading(LoaderType.CUSTOMER_BOOKING)
  async openCreditCardDetails() {
    const card = this.details.creditCard;
    if (!card) { throw new Error('creditCard property required'); }
    if (!card.token) { throw new Error('token property required'); }

    if (card && card.pciExpired) {
      return this.modal.openSimpleText('BackEnd_WikiLanguage.pci_expired');
    }

    const { useCCProxy, count } = await this.apiClient.getPCIInfo(card.token, this.isChannelManager).toPromise();

    if (!useCCProxy) {
      this.modal.openForms('BackEnd_WikiLanguage.creditCardPCIAdScreenTitle', AdvertisementComponent, {
        hidePrimaryButton: true,
        ngbOptions: {
          size: 'xl'
        }
      });
    } else if (count > 3) {
      this.modal.openSimpleText('BackEnd_WikiLanguage.pci_TooManyRequests');
    } else {
      await this.apiClient.increasePCICounter(card.token, this.isChannelManager).toPromise();
      const modalData = this.modal.openForms('BackEnd_WikiLanguage.creditCardPCIAdScreenTitle', PaymentInfoComponent, {
        hidePrimaryButton: true
      });
      modalData.modalBody.cardURI = card.token;
    }
  }

  openDoc(url: string) {
    if (url) { window.open(url); }
  }

  openGuestInformation() {
    openGuestInformation(this.viewService, { bookingId: this.item.id });
  }
}
