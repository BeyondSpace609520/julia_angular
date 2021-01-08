import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { LoaderService } from '@/app/shared/loader.service';
import { CustomerBooking, CustomerBookingLog } from '../../../models';

@Component({
  selector: 'app-booking-log',
  templateUrl: './log.component.pug',
  styleUrls: ['./log.component.sass']
})
export class LogComponent implements OnInit {

  @Input() item: CustomerBooking;

  public logs: Observable<CustomerBookingLog[]>;
  public fieldGroups = {
    booking_added: [
      { id: 'lang', label: 'BackEnd_WikiLanguage.log_b_l_nameDisplay' },
      { id: 'status', label: 'BackEnd_WikiLanguage.log_b_bs_name' },
      { id: 'guestId', label: 'BackEnd_WikiLanguage.log_b_customer_id' },
      { id: 'payment', label: 'BackEnd_WikiLanguage.log_b_pml_name' },
      { id: 'bookingNumber', label: 'BackEnd_WikiLanguage.log_b_bookingNo' },
      { id: 'emailText', label: 'BackEnd_WikiLanguage.log_b_emailText' },
      { id: 'headerText', label: 'BackEnd_WikiLanguage.log_b_headerText' },
      { id: 'footerText', label: 'BackEnd_WikiLanguage.log_b_footerText' },
      { id: 'depositProposed', label: 'BackEnd_WikiLanguage.log_b_prepaymentAmount' },
      { id: 'depositPaid', label: 'BackEnd_WikiLanguage.log_b_prepaymentAmountPaid' },
      { id: 'depositDueDate', label: 'BackEnd_WikiLanguage.log_b_prepaymentDueDate' },
      { id: 'paymentReminderDate', label: 'BackEnd_WikiLanguage.log_b_prepaymentReminderSentDate' },
      { id: 'cancellationFee', label: 'BackEnd_WikiLanguage.log_b_cancellationFee' },
      { id: 'validUntilDate', label: 'BackEnd_WikiLanguage.log_b_validUntil' },
      { id: 'locked', label: 'BackEnd_WikiLanguage.log_b_locked' }
    ],
    room_added: [
      { id: 'roomId', label: 'BackEnd_WikiLanguage.log_eb_e_uniqueNo' },
      { id: 'specialOffer', label: 'BackEnd_WikiLanguage.log_eb_specialOfferTitle' },
      { id: 'arrival', label: 'BackEnd_WikiLanguage.log_eb_fromDate' },
      { id: 'departure', label: 'BackEnd_WikiLanguage.log_eb_untilDate' },
      { id: 'catering', label: 'BackEnd_WikiLanguage.log_eb_stl_name' },
      { id: 'nights', label: 'BackEnd_WikiLanguage.log_eb_nightsStay' },
      { id: 'persons', label: 'BackEnd_WikiLanguage.log_eb_noOfPersons' },
      { id: 'children', label: 'BackEnd_WikiLanguage.log_eb_noOfChildren' },
      { id: 'smallPets', label: 'BackEnd_WikiLanguage.log_eb_noOfPetsSmall' },
      { id: 'largePets', label: 'BackEnd_WikiLanguage.log_eb_noOfPetsLarge' },
      { id: 'babyBeds', label: 'BackEnd_WikiLanguage.log_eb_noOfCots' },
      { id: 'parkingSpace', label: 'BackEnd_WikiLanguage.log_eb_noOfGarages' },
      { id: 'childrenAges', label: 'BackEnd_WikiLanguage.log_eb_childrenAges' },
      { id: 'priceAdults', label: 'BackEnd_WikiLanguage.log_eb_totalEntityPriceAdults' },
      { id: 'priceChildren', label: 'BackEnd_WikiLanguage.log_eb_totalEntityPriceChildren' },
      { id: 'priceCatering', label: 'BackEnd_WikiLanguage.log_eb_totalServiceCharge' },
      { id: 'visitorsTax', label: 'BackEnd_WikiLanguage.log_eb_totalVisitorsTax' },
      { id: 'pricePets', label: 'BackEnd_WikiLanguage.log_eb_totalPetCharge' },
      { id: 'cleaningCharge', label: 'BackEnd_WikiLanguage.log_eb_totalCleanUpCharge' },
      { id: 'totalDiscount', label: 'BackEnd_WikiLanguage.log_eb_totalDiscount' },
      { id: 'shortStayCharge', label: 'BackEnd_WikiLanguage.log_eb_totalShortStayCharge' },
      { id: 'priceBabyBeds', label: 'BackEnd_WikiLanguage.log_eb_totalCotCharge' },
      { id: 'priceParking', label: 'BackEnd_WikiLanguage.log_eb_totalGarageCharge' },
      { id: 'surcharges', label: 'BackEnd_WikiLanguage.log_eb_totalChargingSchemeCharge' },
      { id: 'total', label: 'BackEnd_WikiLanguage.log_eb_totalNet' }
    ]
  };
  public isLoading: Observable<boolean>;

  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading();
  }

  ngOnInit(): void {
    this.logs = this.httpClient.get<CustomerBookingLog[]>('/customer-admin/booking/log');
  }

}
