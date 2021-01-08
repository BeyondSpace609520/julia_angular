import { Injectable } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { ViewService } from '@/app/main/view/view.service';
import { Guest } from '../customer-more-information/models';
import { GuestDetail } from '../guest-information/models';
import { GuestInformationProps, openGuestInformation, ValidationLevel } from '../guest-information/utils';
import { GuestRegistrationForm, GuestRegistrationItem, HotelRegistrationRecord, RegistrationType } from '../guest-registration/models';
import { RegistrationFormGuests, RegistrationGuestTypes } from './models';

@Injectable()
export class CreateRegistrationFormService {

  hotel!: HotelRegistrationRecord;
  bookingId!: GuestRegistrationItem['bookingId'];
  registrationForm?: GuestRegistrationForm;
  isChannelManager: boolean;
  linkedGuestsCount: number;

  constructor(
    private apiClient: ApiClient,
    private cacheService: CacheService,
    private viewService: ViewService,
  ) { }

  async initialize(
    registrationFormId: number | undefined,
    hotel: HotelRegistrationRecord,
    bookingId: GuestRegistrationItem['bookingId']
  ): Promise<[
      RegistrationFormGuests | null,
      RegistrationType[],
      GuestDetail[],
      {fromDate: Date, untilDate: Date},
      RegistrationGuestTypes
    ]> {

    this.hotel = hotel;
    this.bookingId = bookingId;

    const [formData, types, individualData, { fromDate, untilDate }, linkedGuestCount, isChannelManager, allGuestTypes] = await Promise.all([
      registrationFormId ? await this.apiClient.getRegistrationForm(registrationFormId).toPromise() : null,
      this.cacheService.getGuestRegistrationTypes(),
      this.apiClient.getBookingGuests(this.bookingId, true, null, this.hotel.id).toPromise(),
      this.apiClient.getBookingInfo(this.bookingId).toPromise(),
      this.apiClient.getLinkedGuestsCount(this.bookingId).toPromise(),
      this.apiClient.isBookingFromChannelManager(this.bookingId).toPromise(),
      this.cacheService.getGuestTypes()
    ]);

    this.registrationForm = formData ? formData.form : undefined;

    this.linkedGuestsCount = linkedGuestCount;
    this.isChannelManager = isChannelManager;

    return [formData, types, individualData, { fromDate, untilDate }, allGuestTypes];
  }

  editGuestInformation(guest: GuestDetail, arrived: boolean, mainGuestId?: Guest['id'], onGuestSaved?: (guest: GuestDetail) => void) {
    const props: GuestInformationProps = {
      hotel: this.hotel,
      bookingId: this.bookingId,
      preselectGuestId: guest.id,
      mainGuestId
    };

    if (arrived || guest.doValidation) {
      props.baseValidation = (
        (this.registrationForm && this.registrationForm.strictValidation) || this.hotel.strictValidation
      ) ? ValidationLevel.Strict : ValidationLevel.Basic;
    }

    openGuestInformation(this.viewService, props, onGuestSaved);
  }
}
