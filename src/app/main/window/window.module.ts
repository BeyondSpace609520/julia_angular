import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';
import { AngularDraggableModule } from 'angular2-draggable';

import { FormErrorService } from '@/app/main/window/shared/services/form-error.service';
import { SharedModule } from '@/app/shared/module';
import { ExportService } from './shared/services/export.service';
import { WindowComponent } from './window.component';
import { WindowsService } from './windows.service';

export const reactiveModules = [
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'companyCustomerAdmin',
    loadChildren: './main/window/content/customer-admin/company-customer-admin/company-customer-admin.module#CompanyCustomerAdminModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'consumerMoreInformation',
    // tslint:disable-next-line: max-line-length
    loadChildren: './main/window/content/customer-admin/customer-more-information/customer-more-information.module#CustomerMoreInformationModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'hotelManagement',
    loadChildren: './main/window/content/my-company/operation-settings/operation-settings.module#OperationSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'portalAAT',
    loadChildren: './main/window/content/my-company/portal-aat/portal-aat.module#PortalAATModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'roomOwnerConfig',
    loadChildren: './main/window/content/my-company/room-owner/room-owner.module#RoomOwnerModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'payment',
    loadChildren: './main/window/content/my-company/payment/payment.module#PaymentModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'generalSettings',
    loadChildren: './main/window/content/customer-admin/general-settings/general-settings.module#GeneralSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'calendarHTML',
    loadChildren: './main/window/content/calendar/calendar-html/calendar-html.module#CalendarHTMLModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'calendarSettings',
    loadChildren: './main/window/content/calendar/calendar-settings/calendar-settings.module#CalendarSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'guestMap',
    loadChildren: './main/window/content/customer-admin/guest-map/guest-map.module#GuestMapModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'productAdmin',
    loadChildren: './main/window/content/services/product/product.module#ProductModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'reportAndListModule',
    loadChildren: './main/window/content/billing/report-and-list/report-and-list.module#ReportAndListModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'addGuestPaymentsModule',
    loadChildren: './main/window/content/billing/add-guest-payments/add-guest-payments.module#AddGuestPaymentsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'BillingOverviewModule',
    loadChildren: './main/window/content/billing/billing-overview/billing-overview.module#BillingOverviewModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'guestInteraction',
    loadChildren: './main/window/content/customer-admin/guest-interaction/guest-interaction.module#GuestInteractionModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'enquiryPool',
    loadChildren: './main/window/content/channel-management/enquiry-pool/enquiry-pool.module#EnquiryPoolModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'statistics',
    loadChildren: './main/window/content/channel-management/statistics/statistics.module#StatisticsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'insurance',
    loadChildren: './main/window/content/services/insurance/insurance.module#InsuranceModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'enquiryPoolSettings',
    loadChildren: './main/window/content/channel-management/enquiry-pool-settings/enquiry-pool-settings.module#EnquiryPoolSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'channelManager',
    loadChildren: './main/window/content/channel-management/channel-manager/channel-manager.module#ChannelManagerModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'seasonPeriods',
    loadChildren: './main/window/content/pricing-admin/season-periods/season-periods.module#SeasonPeriodsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'seasonPeriodsSettings',
    loadChildren: './main/window/content/pricing-admin/season-periods-settings/season-periods-settings.module#SeasonPeriodsSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'cateringSettings',
    loadChildren: './main/window/content/pricing-admin/catering-settings/catering-settings.module#CateringSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'visitorsTaxSettings',
    loadChildren: './main/window/content/pricing-admin/visitors-tax-settings/visitors-tax-settings.module#VisitorsTaxSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'roomCategory',
    loadChildren: './main/window/content/room-admin/room-category/room-category.module#RoomCategoryModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'roomsApartments',
    loadChildren: './main/window/content/room-admin/rooms-apartments/rooms-apartments.module#RoomsApartmentsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'billingSettings',
    loadChildren: './main/window/content/billing/billing-settings/billing-settings.module#BillingSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'wishRoomAdministration',
    loadChildren: './main/window/content/room-admin/wish-room-administration/wish-room-administration.module#WishRoomAdministrationModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'licenseUpsellingModule',
    loadChildren: './main/window/content/room-admin/license-upselling/license-upselling.module#LicenseUpsellingModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'bookingTools',
    loadChildren: './main/window/content/web-tools/booking-tools/booking-tools.module#BookingToolsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'supportFormNew',
    loadChildren: './main/window/content/my-eb/support-form-new/support-form-new.module#SupportFormNewModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'sugarInvoices',
    loadChildren: './main/window/content/my-eb/sugar-invoices/sugar-invoices.module#SugarInvoicesModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'extraCharges',
    loadChildren: './main/window/content/pricing-admin/extra-charges/extra-charges.module#ExtraChargesModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'ageGroups',
    loadChildren: './main/window/content/pricing-admin/age-groups/age-groups.module#AgeGroupsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'lastMinutes',
    loadChildren: './main/window/content/pricing-admin/last-minutes/last-minutes.module#LastMinutesModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'longStayDiscount',
    loadChildren: './main/window/content/pricing-admin/long-stay-discount/long-stay-discount.module#LongStayDiscountModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'earlyBirdDiscount',
    loadChildren: './main/window/content/pricing-admin/early-bird-discount/early-bird-discount.module#EarlyBirdDiscountModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'guestInformation',
    loadChildren: './main/window/content/customer-admin/guest-information/guest-information.module#GuestInformationModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'chargingScheme',
    loadChildren: './main/window/content/pricing-admin/charging-scheme/charging-scheme.module#ChargingSchemeModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'templateAdmin',
    loadChildren: './main/window/content/my-company/template-admin/template-admin.module#TemplateAdminModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'fileAdmin',
    loadChildren: './main/window/content/my-company/file-admin/file-admin.module#FileAdminModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'guestRegistration',
    loadChildren: './main/window/content/customer-admin/guest-registration/guest-registration.module#GuestRegistrationModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'createRegistrationForm',
    // tslint:disable-next-line: max-line-length
    loadChildren: './main/window/content/customer-admin/create-registration-form/create-registration-form.module#CreateRegistrationFormModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'specialOffers',
    loadChildren: './main/window/content/services/special-offers/special-offers.module#SpecialOffersModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'specialOffersSettings',
    loadChildren: './main/window/content/services/special-offers-settings/special-offers-settings.module#SpecialOffersSettingsModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'portal',
    loadChildren: './main/window/content/my-company/portal/portal.module#PortalModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'website',
    loadChildren: './main/window/content/web-tools/website/website.module#WebsiteModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'customers',
    loadChildren: './main/window/content/administration/customers/customers.module#CustomersModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'customerReporting',
    loadChildren: './main/window/content/administration/customer-reporting/customer-reporting.module#CustomerReportingModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'portalAdmin',
    loadChildren: './main/window/content/administration/portal-admin/portal-admin.module#PortalAdminModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'databaseValidation',
    loadChildren: './main/window/content/administration/database-validation/database-validation.module#DatabaseValidationModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'adminMessageCenter',
    loadChildren: './main/window/content/administration/message-center/message-center.module#MessageCenterModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'multiUser',
    loadChildren: './main/window/content/administration/multi-user/multi-user.module#MultiUserModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'guestRegistrationConfig',
    // tslint:disable-next-line:max-line-length
    loadChildren: './main/window/content/customer-admin/guest-registration-config/guest-registration-config.module#GuestRegistrationConfigModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'legalDocs',
    loadChildren: './main/window/content/administration/legal-docs/legal-docs.module#LegalDocsModule'
  }),
];

@NgModule({
  declarations: [WindowComponent],
  exports: [WindowComponent],
  imports: [
    CommonModule,
    NgbModule,
    AngularDraggableModule,
    SharedModule,
    ReactiveComponentLoaderModule.forRoot()
  ],
  providers: [
    WindowsService,
    ExportService,
    FormErrorService,
  ]
})
export class WindowModule { }
