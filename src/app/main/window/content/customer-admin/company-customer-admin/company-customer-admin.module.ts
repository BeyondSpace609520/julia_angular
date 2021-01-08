import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { StarRatingModule } from 'angular-star-rating';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';
import { AnonymizeCustomerModule } from '../../../shared/customer/anonymize/anonymize.module';
import { ChooseCustomerModule } from '../../../shared/customer/choose/choose-customer.module';
import { FormBuilderModule } from '../../../shared/forms/forms.module';
import { InteractionModule } from '../../../shared/interaction/interaction.module';
import { SettingsButtonModule } from '../../../shared/settings-button//settings-button.module';
import { TableModule } from '../../../shared/table/table.module';
import { CompanyCustomerAdminComponent } from './company-customer-admin.component';
import { ExportComponent } from './export/export.component';
import { BookingComponent } from './tabs/booking/booking.component';
import { AdvertisementComponent } from './tabs/booking/detail/advertisement/advertisement.component';
import { BookingDetailComponent } from './tabs/booking/detail/detail.component';
import { PaymentInfoComponent } from './tabs/booking/detail/payment-info/payment-info.component';
import { LogComponent } from './tabs/booking/log/log.component';
import { RoomsComponent } from './tabs/booking/rooms/rooms.component';
import { DetailComponent } from './tabs/detail/detail.component';
import { MergeGuestComponent } from './tabs/detail/merge-guest/merge-guest.component';
import { SendProvisionComponent } from './tabs/detail/send-provision/send-provision.component';
import { InteractionComponent } from './tabs/interaction/interaction.component';
import { RatingComponent } from './tabs/rating/rating.component';

@NgModule({
  declarations: [
    CompanyCustomerAdminComponent,
    RatingComponent,
    DetailComponent,
    BookingComponent,
    InteractionComponent,
    SendProvisionComponent,
    RoomsComponent,
    LogComponent,
    BookingDetailComponent,
    ExportComponent,
    MergeGuestComponent,
    AdvertisementComponent,
    PaymentInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    StarRatingModule.forRoot(),
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    ReactiveFormsModule,
    MainSharedModule,
    NgbProgressbarModule,
    HttpModule.forRoot(),
    SettingsButtonModule,
    AnonymizeCustomerModule,
    ChooseCustomerModule,
    FormBuilderModule,
    InteractionModule,
    TableModule
  ],
  entryComponents: [
    CompanyCustomerAdminComponent,
    SendProvisionComponent,
    ExportComponent,
    MergeGuestComponent,
    AdvertisementComponent,
    PaymentInfoComponent,
  ]
})
export class CompanyCustomerAdminModule { }
