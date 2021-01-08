import { MinMaxPersons, PricingForBEFE, ServiceTypeForPeriod } from '@/ui-kit/components/modals/pricing-test-console/models';
import { Injectable } from '@angular/core';

import dayjs from 'dayjs';
import _ from 'lodash';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';

import { ApiService, FileUploadType } from '@/app/helpers/api/api.service';
import { PrintPrepaymentParameter } from '@/app/helpers/models';
import { MultiUserCreateResponse } from '@/app/main/window/content/administration/multi-user/models';
import { GetStatisticsRequestParams, RawStatistics } from '@/app/main/window/content/channel-management/statistics/models';

import { RawAutoAnonymizationSettings } from '@/app/main/window/content/customer-admin/general-settings/tabs/gdpr/models';
import { reduceAutoAnonymizationSettings } from '@/app/main/window/content/customer-admin/general-settings/tabs/gdpr/reduce';
import { Trigger } from '../main/models';
import { FormOption } from '../main/shared/form-data.service';
import { BillableCustomer, RawBillableCustomer } from '../main/window/content/administration/customer-reporting/models';
import { reduceBillableCustomer } from '../main/window/content/administration/customer-reporting/reduce';
import {
  CustomerItem,
  CustomerUser,
  LoginMessage,
  RawCustomerItem,
  RawCustomerUser,
  RawLoginMessage
} from '../main/window/content/administration/customers/models';
import {
  prepareLoginMessageBody,
  reduceCustomerItem,
  reduceCustomerItemDetails,
  reduceCustomerUser,
  reduceLoginMessage
} from '../main/window/content/administration/customers/reduce';
import { RoomPriceError, ValidateAllResponse } from '../main/window/content/administration/database-validation/models';
import {
  PortalAdmin,
  PortalAdminBody,
  PortalAdminCategory,
  PortalAdminCategoryPackage,
  PortalAdminCategoryTranslation,
  PortalAdminCustomer,
  PortalAdminCustomerSearched,
  RawPortalAdmin,
  RawPortalAdminCategoryPackage,
  RawPortalAdminCategoryTranslation,
  RawPortalAdminCustomer
} from '../main/window/content/administration/portal-admin/models';
import {
  prepareAdminPortalBody,
  reducePortalAdmin,
  reducePortalAdminCategory,
  reducePortalAdminCustomer
} from '../main/window/content/administration/portal-admin/reduce';
import { RegForm } from '../main/window/content/billing/billing-overview/tabs/billing-invoices-tab/manage-invoice/form/models';

import {
  Invoice,
  InvoiceRequestData,
  RawInvoice,
  RawPaymentBody,
  VersionDetail
} from '../main/window/content/billing/billing-overview/tabs/billing-invoices-tab/manage-invoice/models';
import {
  PrintPaymentCardResponse,
  PrintPaymentCashResponse,
  RawPrintPaymentCardResponse,
  RawPrintPaymentCashResponse
} from '../main/window/content/billing/billing-overview/tabs/billing-invoices-tab/manage-invoice/payments/models';
import {
  reduceResponse1,
  reduceResponse2
} from '../main/window/content/billing/billing-overview/tabs/billing-invoices-tab/manage-invoice/payments/reduce';
import {
  inverseReduceDetail,
  prepareInvoiceRequestData
} from '../main/window/content/billing/billing-overview/tabs/billing-invoices-tab/manage-invoice/reduce';
import {
  InvoicesRequestParams,
  RawBillingOverviewData
} from '../main/window/content/billing/billing-overview/tabs/billing-invoices-tab/models';
import {
  prepareInvoicesParams,
  reduceBillingInvoice
} from '../main/window/content/billing/billing-overview/tabs/billing-invoices-tab/reduce';
import { CalendarSettings, RawCalendarSettings } from '../main/window/content/calendar/calendar-settings/models';
import { prepareCalendarSettingsBody, reduceCalendarSettings } from '../main/window/content/calendar/calendar-settings/reduce';
import { GetRequestParams, RawEnquiry } from '../main/window/content/channel-management/enquiry-pool/models';
import {
  CustomerBooking,
  RawCustomer,
  RawCustomerBooking,
  RawCustomerDetail,
  RawCustomerDetailBody
} from '../main/window/content/customer-admin/company-customer-admin/models';
import { reduceCustomerBooking } from '../main/window/content/customer-admin/company-customer-admin/reduce';
import {
  BookingDetail,
  BookingRoom,
  GuestRelatedDetail,
  RawBookingDetail,
  RawBookingRoom,
  RawGuestRelatedDetail
} from '../main/window/content/customer-admin/company-customer-admin/tabs/booking/models';
import {
  reduceBookingDetail,
  reduceBookingRooom,
  reduceGuestRelatedDetail
} from '../main/window/content/customer-admin/company-customer-admin/tabs/booking/reduce';
import { prepareCustomerBody } from '../main/window/content/customer-admin/company-customer-admin/tabs/detail/merge-guest/reduce';
import { CustomerRating, RawCustomerRating } from '../main/window/content/customer-admin/company-customer-admin/tabs/rating/models';
import { prepareRatingBody, reduceCustomerRating } from '../main/window/content/customer-admin/company-customer-admin/tabs/rating/reduce';
import {
  GroupGuest,
  RawGroupGuest,
  RegFormBody,
  RegistrationFormGuests,
} from '../main/window/content/customer-admin/create-registration-form/models';
import {
  prepareGroupGuestBody,
  prepareIndividualGuestBody,
  prepareRegFormBody,
  reduceGroupGuest,
} from '../main/window/content/customer-admin/create-registration-form/reduce';
import { prepareBookingGuestBody } from '../main/window/content/customer-admin/customer-more-information/reduce';
import {
  Arrival,
  BookingSource,
  Characteristic,
  DocumentType,
  GuestRating,
  VisitReason
} from '../main/window/content/customer-admin/general-settings/models';
import { GuestDetail, RawGuestDetail } from '../main/window/content/customer-admin/guest-information/models';
import { prepareBookingGuestDetailBody, reduceGuestDetail } from '../main/window/content/customer-admin/guest-information/reduce';
import {
  BasicGuestRegistrationForm,
  GuestRegistrationForm,
  GuestRegistrationFormDetail,
  GuestRegistrationItem,
  HotelRegistrationRecord,
  RawGuestRegistrationForm,
  RawGuestRegistrationFormDetail,
  RawGuestRegistrationItem,
  ViewMode
} from '../main/window/content/customer-admin/guest-registration/models';
import {
  prepareBookingListBody,
  prepareRegistrationFormsBody,
  reduceGuestRegistrationItem,
  reduceRegistrationForm,
  reduceRegistrationFormDetail
} from '../main/window/content/customer-admin/guest-registration/reduce';
import { SearchData as GuestRegistrationSearchData } from '../main/window/content/customer-admin/guest-registration/tabs/tab';
import { Providers } from '../main/window/content/customer-admin/create-registration-form/consts';
import { FileEntity, Folder, RawFileEntity, RawFolder } from '../main/window/content/my-company/file-admin/models';
import { reduceFile, reduceFolders } from '../main/window/content/my-company/file-admin/reduce';
import {
  Portal,
  PortalCategory,
  PortalFeature,
  PortalImage,
  RawPortal,
  RawPortalCategory,
  RawPortalFeature
} from '../main/window/content/my-company/portal/models';
import {
  preparePortalBody,
  reducePortal,
  reducePortalCategory,
  reducePortalFeature
} from '../main/window/content/my-company/portal/reduce';
import {
  EmailTemplate,
  EmailTemplateDetail,
  EmailTemplateImages,
  EmailTemplateType,
  RawEmailTemplate,
  RawEmailTemplateDetail,
  RawEmailTemplateImages
} from '../main/window/content/my-company/template-admin/models';
import {
  prepareEmailTemplateDetailBody,
  reduceEmailTemplate,
  reduceEmailTemplateDetail,
  reduceEmailTemplateImages
} from '../main/window/content/my-company/template-admin/reduce';
import { AgeGroup, RawAgeGroup } from '../main/window/content/pricing-admin/age-groups/models';
import { prepareAgeGroup, reduceAgeGroup } from '../main/window/content/pricing-admin/age-groups/reduce';
import {
  AnyChargingScheme,
  CateringSchemeType,
  ChargingScheme,
  ChargingSchemeBody,
  ChargingSchemeDetail,
  ChargingSchemeLinkedCategory,
  ChargingSchemeTypeRecord,
  RawChargingScheme
} from '../main/window/content/pricing-admin/charging-scheme/models';
import {
  prepareChargingSchemeBody,
  reduceChargingScheme,
  reduceChargingSchemeDetail
} from '../main/window/content/pricing-admin/charging-scheme/reduce';
import {
  EarlyBirdDiscountDetail,
  RawEarlyBirdDiscount,
  RawEarlyBirdDiscountDetail
} from '../main/window/content/pricing-admin/early-bird-discount/models';
import {
  prepareEarlyBirdDiscountBody,
  reduceEarlyBirdDiscountDetail
} from '../main/window/content/pricing-admin/early-bird-discount/reduce';
import {
  ExtraCharge,
  ExtraChargeDetails,
  ExtraChargeRequestBody,
  RawExtraCharge,
  RawExtraChargeDetails
} from '../main/window/content/pricing-admin/extra-charges/models';
import { prepareExtraChargeBody, reduceCharge, reduceChargeDetails } from '../main/window/content/pricing-admin/extra-charges/reduce';
import {
  LastMinutes,
  LastMinutesItem,
  LastMinutesItemBody,
  RawLastMinutes
} from '../main/window/content/pricing-admin/last-minutes/models';
import { prepareLastMinutesBody, reduceLastMinutes } from '../main/window/content/pricing-admin/last-minutes/reduce';
import {
  LongStayDiscountDetail,
  LongStayDiscountRate,
  RawLongStayDiscount
} from '../main/window/content/pricing-admin/long-stay-discount/models';
import {
  prepareLongStayDiscountBody,
  prepareLongStayRateBody,
  reduceLongStayDiscountDetail
} from '../main/window/content/pricing-admin/long-stay-discount/reduce';
import {
  RawSeasonPeriod,
  RawSeasonPeriodDetail,
  SeasonPeriod,
  SeasonPeriodDetail
} from '../main/window/content/pricing-admin/season-periods/models';
import {
  inverseReduceSeasonPeriodDetail,
  reduceSeasonPeriod,
  reduceSeasonPeriodDetail
} from '../main/window/content/pricing-admin/season-periods/reduce';
import { RawCategoryPictureEntity, RawRoomCategory, RoomCategory } from '../main/window/content/room-admin/room-category/models';
import {
  prepareCategoryBody,
  prepareCategoryPictureBody,
  reduceCategoryPicture,
  reduceRoomCategory
} from '../main/window/content/room-admin/room-category/reduce';
import {
  ApartmentDescription,
  ApartmentDetail,
  ApartmentRoom,
  RawApartmentDetail,
  RawApartmentPictureEntity,
  RawRoomsValidationResponse,
  RoomListItem,
  RoomType
} from '../main/window/content/room-admin/rooms-apartments/models';
import {
  prepareApartmentBody,
  prepareApartmentPictureBody,
  prepareRoomsBody,
  reduceApartmentDetail,
  reduceApartmentPicture,
  reduceValidation
} from '../main/window/content/room-admin/rooms-apartments/reduce';
import { RawContract } from '../main/window/content/services/insurance/models';
import {
  InsuranceType,
  KeyValue
} from '../main/window/content/services/insurance/offer-overview/key-value-modal/key-value-modal.component';
import {
  RawSpecialOffer,
  RawSpecialOfferDetails,
  RawSpecialOfferPeriod,
  RawSpecialOfferPricing,
  SpecialOffer,
  SpecialOfferDetails,
  SpecialOfferPeriod,
  SpecialOfferPeriodPricing,
  SpecialOfferPricing
} from '../main/window/content/services/special-offers/models';
import {
  prepareSpecialOfferBody,
  prepareSpecialOfferPricingBody,
  prepareSpecialOfferPricingItems,
  reduceSpecialOffer,
  reduceSpecialOfferDetails,
  reduceSpecialOfferPeriod,
  reduceSpecialOfferPeriodPricing,
  reduceSpecialOfferPricing
} from '../main/window/content/services/special-offers/reduce';
import {
  RawWebsitePages,
  RawWebsitePicture,
  WebsitePage,
  WebsitePages,
  WebsitePageSource,
  WebsitePictureSource
} from '../main/window/content/web-tools/website/models';
import { reduceWebsitePages, reduceWebsitePicture } from '../main/window/content/web-tools/website/reduce';
import { CopyToId } from '../main/window/shared/copy-to/copy-to.component';
import { CustomerConfirmParams } from '../main/window/shared/customer/anonymize/models';
import { CustomerFormResources, RawCustomerFormResources } from '../main/window/shared/customer/form/models';
import { reduceCustomerFormResources } from '../main/window/shared/customer/form/reduce';
import { Customer } from '../main/window/shared/customer/models';
import { reduceCustomer } from '../main/window/shared/customer/reduce';
import { Discount } from '../main/window/shared/discount/models';
import { reduceDiscount } from '../main/window/shared/discount/reduce';
import { PictureEntity, PictureSource } from '../main/window/shared/image-selector/models';
import { Interaction, InteractionSearchData, RawInteraction } from '../main/window/shared/interaction/models';
import { prepareGetInteractionsParams, reduceInteraction } from '../main/window/shared/interaction/reduce';
import { LayoutSource } from '../main/window/shared/layout-uploader/models';
import {
  Pricing,
  PricingConfig,
  PricingScheme,
  PricingSource,
  RawPricing,
  RawPricingScheme,
  RawServiceType,
  ServiceType
} from '../main/window/shared/pricing-settings/models';
import {
  preparePricingBody,
  preparePricingConfigBody,
  reducePricing,
  reducePricingConfig,
  reducePricingScheme,
  reduceServiceType
} from '../main/window/shared/pricing-settings/reduce';
import { RawFeature } from '../main/window/shared/room-features/models';
import { parseDate } from './date';

const pictureSources: {[key in PictureSource]: (p: string) => [string, string]} = {
    category: prefix =>  ['EntityGroupPic', prefix + 'EntityGroupPic'],
    apartment: prefix => ['EntityPic', prefix + 'EntityPic'],
};

// TODO separate these methods into smaller services in ./api/

@Injectable()
export class ApiClient {

  company = null;
  printLinkSession: string | null;

  constructor(private apiService: ApiService) { }

  getCompanyCustomers(text: string, customerId?: number): Observable<Customer[]> {
    const parameters: any[] = [text, 'appUser'];
    // if customerId is set, convert it to true and use the id as search parameter
    if (customerId) {
      parameters.length = 0;
      parameters.push(customerId, 'appUser', true);
    }
    return this.apiService.mainApiPost<RawCustomer[] | ['ZERO']>(parameters, 'CompanyCustomerAdmin', 'getCompanyCustomers').pipe(
      map(customers => customers[0] === 'ZERO' ? [] : (customers as RawCustomer[]).map(reduceCustomer))
    );
  }

  startExport(serialNumber: string) {
    return this.apiService.mainApiPost([ serialNumber ], 'CompanyCustomerAdmin', 'startExport');
  }

  checkExportProgress() {
    return this.apiService.mainApiPost<'WRITING_EXCEL_FILE' | string>([ 'appUser' ], 'CompanyCustomerAdmin', 'checkExportProgress')
      .pipe(map(v => v[0]));
  }

  removeProgressFile() {
    return this.apiService.mainApiPost<string>([ 'appUser' ], 'CompanyCustomerAdmin', 'removeProgressfile')
      .pipe(map(v => v[0]));
  }

  getCompanyCustomerDetail(customerId: number) {
    return this.apiService.mainApiPost<RawCustomerDetail>([ customerId, 'appUser' ], 'CompanyCustomerDetail', 'getCompanyCustomerDetail');
  }

  anonymizeCustomer(customerId: number) {
    return this.apiService.mainApiPost<CustomerConfirmParams>([ customerId, 'appUser' ], 'CompanyCustomerAdmin', 'anonymizeCustomer');
  }

  sendAnonymizeConfirmationComments(params: CustomerConfirmParams, email: string) {
    return this.apiService.mainApiPost([ params, email, 'appUser' ], 'EBMailUtil', 'sendAnonymizeConfirmation');
  }

  sendProvisionOfInformation(params: {c_id: string}, email: string) {
    return this.apiService.mainApiPost([ params, email, 'appUser', true ], 'EBMailUtil', 'sendAnonymizeConfirmation');
  }

  saveCompanyCustomerDetail(params: RawCustomerDetailBody) {
    return this.apiService.mainApiPost<[string]>([ { ...params, action: 'update' }, 'appUser' ],  'CompanyCustomerDetail', 'adminCompanyCustomerDetail')
      .pipe(map(v => v[0]));
  }

  createCompanyCustomer(params: RawCustomerDetailBody) {
    return this.apiService.mainApiPost<[string]>([
      { ...params, action: 'insert', c_id: '0' }, 'appUser'
    ], 'CompanyCustomerDetail', 'adminCompanyCustomerDetail')
      .pipe(map(v => v[0]));
  }

  getCharacteristics(localeId: number) {
    return this.apiService.mainApiPost<Characteristic[]>([ { chl_locale_id: localeId }, 'appUser' ], 'registrationForm', 'getCharacteristics');
  }

  saveCharacteristics(characteristics: Characteristic[], localeId: number) {
    return this.apiService.mainApiPost([ { characteristicsARR: characteristics.map(c => ({
        chl_value: c.chl_value,
        chl_characteristics_id: c.ch_id
      })), chl_locale_id: localeId }, 'appUser' ],
      'registrationForm', 'setCharacteristics');
  }

  newCharacteristic(name: string) {
    return this.apiService.mainApiPost([ { chl_value: name }, 'appUser' ], 'registrationForm', 'newCharacteristics');
  }

  getVisitReasons(localeId: number) {
    return this.apiService.mainApiPost<VisitReason[]>([ { vrl_locale_id: localeId }, 'appUser' ], 'registrationForm', 'getVisitReason');
  }

  saveVisitReasons(reasons: VisitReason[], localeId: number) {
    return this.apiService.mainApiPost([ {
      vrl_locale_id: localeId,
      visitReasonARR: reasons.map(r => ({ vrl_visitReason_id: r.vr_id, vrl_value: r.vrl_value }))
    }, 'appUser' ], 'registrationForm', 'setVisitReason');
  }

  newVisitReason(name: string) {
    return this.apiService.mainApiPost([ { vrl_value: name }, 'appUser' ], 'registrationForm', 'newVisitReason');
  }

  getArrivals(localeId: number) {
    return this.apiService.mainApiPost<Arrival[]>([ { aml_locale_id: localeId }, 'appUser' ], 'registrationForm', 'getArrivalMethod');
  }

  saveArrivals(arrivals: Arrival[], localeId: number) {
    return this.apiService.mainApiPost([ {
      aml_locale_id: localeId,
      arrivalMethodARR: arrivals.map(r => ({ aml_arrivalMethod_id: r.am_id, aml_value: r.aml_value }))
    }, 'appUser' ], 'registrationForm', 'setArrivalMethod');
  }

  newArrival(name: string) {
    return this.apiService.mainApiPost([ { aml_value: name }, 'appUser' ], 'registrationForm', 'newArrivalMethod');
  }

  getDoctypes(localeId: number) {
    return this.apiService.mainApiPost<DocumentType[]>([ { dtl_locale_id: localeId }, 'appUser' ], 'registrationForm', 'getDoctype');
  }

  saveDoctypes(arrivals: DocumentType[], localeId: number) {
    return this.apiService.mainApiPost([ {
      dtl_locale_id: localeId,
      documentTypeARR: arrivals.map(r => ({ dtl_documentType_id: r.dt_id, dtl_value: r.dtl_value }))
    }, 'appUser' ], 'registrationForm', 'setDoctype');
  }

  newDoctype(name: string) {
    return this.apiService.mainApiPost([ { dtl_value: name }, 'appUser' ], 'registrationForm', 'newDoctype');
  }

  getAutoAnonymizationSettings() {
    return this.apiService.mainApiPost<RawAutoAnonymizationSettings>(['appUser'], 'CompanyCustomerAdmin', 'getAutoAnonymizationSettings').pipe(
      map(reduceAutoAnonymizationSettings)
    );
  }

  saveAutoAnonymizationSettings(postData: RawAutoAnonymizationSettings) {
    return this.apiService.mainApiPost([postData, 'appUser'], 'CompanyCustomerAdmin', 'setAutoAnonymizationSettings');
  }

  getExcelExportAnonymizationReport() {
    return this.apiService.mainApiPostText(['appUser'], 'CompanyCustomerAdmin', 'excelExportAnonymizationReport');
  }

  getGuestRating() {
    return this.apiService.mainApiPost<GuestRating>(['appUser'], 'CompanyCustomerReview', 'getCompanyFields');
  }

  saveGuestRating(field: string, active: boolean) {
    return this.apiService.mainApiPost([field, active ? 'on' : 'off', 'appUser'], 'CompanyCustomerReview', 'setCompanyField');
  }

  getCustomBookingSources(sync: boolean, localeId: number) {
    return this.apiService.mainApiPost<BookingSource[]>([
      'appUser', sync, { cbsl_locale_id: localeId }
    ], 'customBookingSource', 'getCustomBookingSources');
  }

  saveBookingSources(sources: BookingSource[], deleteIds: string[], localeId: number) {
    return this.apiService.mainApiPost<BookingSource[]>([
      {
        cbsl_locale_id: localeId,
        delList: deleteIds,
        customBookingSourceARR: sources.map(s => ({
          cbs_show: s.cbs_show,
          cbsl_customBookingSource_id: s.cbs_id,
          cbsl_value: s.cbsl_value
        }))
      }, 'appUser'], 'customBookingSource', 'setCustomBookingSources');
  }

  validateBookingSources(ids: string[], langId: number) {
    return this.apiService.mainApiPost<'OK' | number>(['appUser', {l_id: langId, ids: ids.join(', ')}], 'customBookingSource', 'validateFields')
      .pipe(map(v => v[0]));
  }

  newBookingSources(name: string) {
    return this.apiService.mainApiPost([{ cbsl_value: name }, 'appUser'], 'customBookingSource', 'newCustomBookingSource');
  }

  getInteractionList(searchData: InteractionSearchData) {
    return this.apiService.mainApiPost<Array<RawInteraction | 'ZERO'>>([prepareGetInteractionsParams(searchData), 'appUser' ], 'CustomerInteraction', 'getCIlist').pipe(
      map(list => list.filter(item => item !== 'ZERO') as RawInteraction[]),
      map(list => list.map(reduceInteraction))
    );
  }

  resendInteraction(interaction: Interaction) {
    const { id, interactionType } = interaction;

    return this.apiService.mainApiPost<[string]>([id, interactionType, 'appUser' ], 'CompanyCustomerInteraction', 'resendInteraction').pipe(
      map(res => res[0]),
      switchMap(status => status === 'YESERRORYES' ? throwError('Can\'t resend') : of(status))
    );
  }

  restoreInteractionPDF(path: string) {
    return this.apiService.mainApiPost([path], 'CustomerInteraction', 'restorePDF');
  }

  getCalendarSettings(): Observable<CalendarSettings> {
    return this.apiService.mainApiPost<RawCalendarSettings>(['appUser'], 'CalendarColor', 'getCalendarColor').pipe(
      map(reduceCalendarSettings)
    );
  }

  saveCalendarSettings(params: CalendarSettings) {
    return this.apiService.mainApiPost([prepareCalendarSettingsBody(params), 'appUser'], 'CalendarColor', 'setCalendarColor');
  }

  getEnquiries({ fromDate, untilDate, autoCHK, manualCHK, openCHK, cancelledCHK, dateFilterOption }: GetRequestParams) {
    return this.apiService.mainApiPost<RawEnquiry[]>([
      'appUser', fromDate, untilDate, autoCHK, manualCHK, openCHK, cancelledCHK, dateFilterOption
    ], 'enquiryPool', 'getEnquiries');
  }

  cancelEnquiry(enquiry: RawEnquiry) {
    return this.apiService.mainApiPost(['appUser', enquiry], 'enquiryPool', 'cancelEnquiry');
  }

  deleteEnquiry(enquiry: RawEnquiry) {
    return this.apiService.mainApiPost(['appUser', enquiry], 'enquiryPool', 'deleteEnquiry');
  }

  sendEnquiryToAirbnb(id: number, decline: boolean, reason?: string, message?: string) {
    return this.apiService.mainApiPost([{
      attempt_action: decline ? 'deny' : 'accept',
      decline_reason: reason,
      decline_message_to_guest: message,
      ep_id: id
    }, 'appUser'], 'enquiryPool', 'sendToAirbnb');
  }

  autoCreateEnquiry(enquiry: RawEnquiry, maxDayTolerance: number | null, nolimits: boolean) {
    interface Resp { status: 'NOTHINGFOUND' | string; }
    return this.apiService.mainApiPost<Resp>(['appUser', enquiry, maxDayTolerance, 'on', nolimits, null, true], 'enquiryPool', 'autoCreateEnquiry');
  }

  setEnquiryStatusToManual(id: number) {
    return this.apiService.mainApiPost<any[]>(['appUser', { ep_id: id }], 'enquiryPool', 'setEnquiryStatusToManual');
  }

  getStatistics({expiry}: GetStatisticsRequestParams): Observable<RawStatistics[]> {
    return this.apiService.mainApiPost<RawStatistics[]>(
      [
        {id: expiry},
        'appUser'
      ],
      'Statistics',
      'getValidUntilReservations'
    );
  }

  getInsuranceMonths() {
    return this.apiService.mainApiPost<string[]>(['appUser'], 'InsuranceProductWorkbench', 'getValidContractMonthList');
  }

  getInsuranceSummary(month: string) {
    return this.apiService.mainApiPost<RawContract[]>([month, 'appUser'], 'InsuranceProductWorkbench', 'getInsuranceProductContractSummary');
  }

  getInsuranceOffers(params: {fromDate: string, untilDate: string}) {
    return this.apiService.mainApiPost<RawContract[]>([params, 'appUser'], 'InsuranceProductWorkbench', 'getInsuranceProductInteraction');
  }

  getInsuranceInterface(id: number, type: InsuranceType): Observable<KeyValue[]> {
    interface ApiKeyValue { keyValue: string; valueValue: string; }
    const params = [type, id, 'appUser'];

    return this.apiService.mainApiPost<ApiKeyValue[]>(params, 'InsuranceProductWorkbench', 'getInsuranceInterfaceReqResp').pipe(map(list => {
      return list.map(item => ({ key: item.keyValue, value: item.valueValue }));
    }));
  }

  billingOverviewGetList(params: InvoicesRequestParams) {
    return this.apiService.mainApiPost<RawBillingOverviewData[]>([prepareInvoicesParams(params), 'appUser'], 'BillingWorkbench', 'getBillingForPeriod').pipe(
      map(list => list.map(reduceBillingInvoice))
    );
  }

  getBookingSources() {
    return this.apiService.mainApiPost<{ iframe_url: string }>(['appUser'], 'bookingSource', 'getBookingSources');
  }

  getCMDirectConnectLink() {
    return this.apiService.mainApiPost<string>(['appUser'], 'bookingSource', 'getCMDirectConnectLink');
  }

  cmDirectConnectNotInterested() {
    return this.apiService.mainApiPost(['cmDirectConnectNotInterested', '1', 'appUser'], 'AppClass', 'setCompanyFlag');
  }

  getBookingPdf(bookingId: number, dbName: string): Observable<string> {
    return this.apiService.mainApiPost<string[]>(
      [
        bookingId,
        'off',
        dbName
      ],
      'EMailTemplate',
      'genBookingPDF'
    ).pipe(map(urlArray => urlArray.length > 0 ? urlArray[0] : ''));
  }

  getEventsPdf(bookingId: number, dbName: string): Observable<string> {
    return this.apiService.mainApiPost<string[]>(
      [
        bookingId,
        'on',
        dbName
      ],
      'feratelEvents',
      'createEventsPDFForBooking'
    ).pipe(map(urlArray => urlArray.length > 0 ? urlArray[0] : ''));
  }

  restoreInvoiceForPermanentlyDeletedBooking(params) {
    return this.apiService.mainApiPost([params, 'appUser'], 'Billing', 'restoreInvoiceForPermanentlyDeletedBooking');
  }

  restoreInvoiceForDeletedStandaloneInvoiceComments(params) {
    return this.apiService.mainApiPost([params, 'appUser'], 'Billing', 'restoreInvoiceForDeletedStandaloneInvoice');
  }

  createNewBill(billFromDate: Date, billUntilDate: Date, dbName: string): Observable<{billId: number, billVersionId: number}> {
    return this.apiService.mainApiPost([billFromDate, billUntilDate, dbName], 'Billing', 'createBillBillVersionStandAlone');
  }

  cleanupStandaloneBill(params) {
    return this.apiService.mainApiPost([params, 'appUser'], 'BillingWorkbench', 'cleanupStandaloneBill');
  }

  generateBillPDF(billId: number | null, bookingId: number | null): Observable<string> {
    return this.apiService.mainApiPost<string[]>(
      [billId, bookingId, 'appUser'],
      'Billing',
      'generateBillVersionPDF'
    ).pipe(map(urlArray => urlArray.length > 0 ? urlArray[0] : ''));
  }

  deleteBill(billId: number): Observable<void> {
    return this.apiService.mainApiPost([billId, 'appUser'], 'Billing', 'deleteBill');
  }

  deleteBillComments(billId: number) { // TODO check what this does
    return this.apiService.mainApiPost([billId, 'appUser'], 'Billing', 'generateBillVersionPDF');
  }

  getBillVersionDetail(refresh: boolean, billId: number, bookingId: number) {
    return this.apiService.mainApiPost<RawInvoice>([refresh ? 'on' : 'off', billId, bookingId, 'appUser'], 'Billing', 'getBillVersionDetail');
  }

  searchCustomers(text: string, exclude?: number) {
    return this.apiService.mainApiPost<RawCustomer[]>([{ searchText: text, c_id_dontshow: exclude }, 'appUser'], 'CompanyCustomerSearch', 'searchCustomers');
  }

  sendInvoiceComments(billId: number, targetId: number, email: string): Observable<[null | string]> {
    return this.apiService.mainApiPost([billId, targetId, email, 'appUser'], 'BillingWorkbench', 'sendInvoiceCustomerMail');
  }

  cancelInvoice(billId: number) {
    return this.apiService.mainApiPost([billId, 'appUser'], 'Billing', 'cancelInvoice');
  }

  getRegForms(billId: number) {
    return this.apiService.mainApiPost<RegForm[]>([billId, 'appUser'], 'registrationForm', 'getRegformsToBooking');
  }

  editInvoiceVersionDetail(detail: VersionDetail, bookingId: number, billingId: number) {
    return this.apiService.mainApiPost<RegForm[]>([
      { bookingId: String(bookingId), billId: String(billingId), ...inverseReduceDetail(detail) }, 'appUser'
    ], 'BillVersionDetail', 'adminVersionDetail');
  }

  deleteInvoiceVersionDetail(detail: VersionDetail) {
    return this.apiService.mainApiPost<RegForm[]>([inverseReduceDetail(detail), 'appUser'], 'Billing', 'deleteBillVersionDetail');
  }

  getPaymentTypes(id?: number) {
    return this.apiService.mainApiPost<any[]>([id || 0, 'appUser'], 'BillVersionPayment', 'getPaymentType');
  }

  // https://trello.com/c/2xuMrnhA/62-billing-billing-overview-edit-invoice-items-clickable-icons-and-buttons-part-1-2
  // > @andreasentscheffpinter The client cannot know, if the saving was successful or not.
  saveInvoicePayment(payment: RawPaymentBody) {
    return this.apiService.mainApiPost([payment, 'appUser'], 'BillVersionPayment', 'adminBillVersionPayment');
  }

  deleteInvoicePayment(payment: RawPaymentBody) {
    return this.apiService.mainApiPost([payment, 'appUser'], 'BillVersionPayment', 'deleteBillVersionPayment');
  }

  cancelInvoicePayment(payment: RawPaymentBody) {
    return this.apiService.mainApiPost([payment, 'appUser'], 'BillVersionPayment', 'cancelCashPayment');
  }
  // >

  setCustomerEmail(customerId: number, email: string) {
    return this.apiService.mainApiPost([customerId, email, 'appUser'], 'BillVersionPayment', 'setEmailForPayment');
  }

  sendPaymentConfirmation(prepayment: boolean, id: number) {
    return this.apiService.mainApiPost([prepayment ? 'on' : 'off', id, 'appUser'], 'BillVersionPayment', 'emailPaymentConfirmation');
  }

  sendPaymentConfirmationFromReceipt(id: number, email: string) {
    return this.apiService.mainApiPost([id, email, 'appUser'], 'BillVersionPayment', 'emailPaymentConfirmationFromReceipt');
  }

  printPaymentConfirmation(prepayment: PrintPrepaymentParameter, id: number): Observable<PrintPaymentCardResponse | PrintPaymentCashResponse> {
    return this.apiService.mainApiPost<RawPrintPaymentCardResponse | RawPrintPaymentCashResponse>([
      prepayment, id, 'appUser'
    ], 'BillVersionPayment', 'printPaymentConfirmation').pipe(
      map(r => {
        if (r.isCashPayment === 'off') { return reduceResponse1(r); }
        return reduceResponse2(r);
      })
    );
  }

  saveInvoice(billingId: number, data: InvoiceRequestData, forceEdit: boolean) {
    const { customer, billNo, regNo, billingText, date, fromDate, untilDate } = prepareInvoiceRequestData(data);

    return this.apiService.mainApiPost([
      billingId,
      customer, billNo, regNo, billingText, date, fromDate, untilDate, '', forceEdit ? 'on' : 'off', 'appUser'
    ], 'Billing', 'adminBillBillVersion').pipe(
        map((res: any) => ({ customerId: res.new_c_id, locale: res.localeChange }))
    );
  }

  generateInvoice(invoice: Invoice) {
    return this.apiService.mainApiPost([
      invoice.billingId, invoice.bookingId, null, invoice.billNo, invoice.custRegNo, invoice.invoiceDate ? dayjs(invoice.invoiceDate).format('YYYY-MM-DD') : null, 'appUser'
    ], 'Billing', 'generateInvoice');
  }

  generateInvoicePDF(billId: number, bookingId: number | null): Observable<string> {
    return this.apiService.mainApiPost<[string]>([
      billId, bookingId, 'appUser'
    ], 'Billing', 'generateBillVersionPDF').pipe(map(res => res[0]));
  }

  getSeasonPeriods() {
    return this.apiService.mainApiPost<RawSeasonPeriod[]>(['appUser'], 'AppClass', 'getSeasonPeriod').pipe(
      map(periods => periods.map(reduceSeasonPeriod))
    );
  }

  getSeasonPeriodDetail(id: number) {
    return this.apiService.mainApiPost<RawSeasonPeriodDetail>([id, 'appUser'], 'SeasonPeriod', 'getSeasonPeriodDetail').pipe(
      map(reduceSeasonPeriodDetail)
    );
  }

  private manageSeasonPeriod(action: 'editForAll' | 'insert' | 'delete',  detail?: SeasonPeriodDetail, id?: number, copyId?: number) {
    return this.apiService.mainApiPost<[number]>([{
      action,
      ...(detail ? inverseReduceSeasonPeriodDetail(detail) : {}),
      sp_id: id || undefined,
      copyFromSPID: copyId || undefined,
    }, 'appUser'], 'SeasonPeriod', 'adminSeasonPeriod').pipe(
      map(r => r[0]),
      switchMap(status => action !== 'delete' && status === 0 ? throwError('Can\'t save period') : of(status))
    );
  }

  addSeasonPeriod(detail: SeasonPeriodDetail, copyFromId?: number) { // copyFromSPID
    return this.manageSeasonPeriod('insert', detail, undefined, copyFromId);
  }

  editSeasonPeriod(id: number, detail: SeasonPeriodDetail) {
    return this.manageSeasonPeriod('editForAll', detail, id);
  }

  deleteSeasonPeriod(id: number) {
    return this.manageSeasonPeriod('delete', undefined, id);
  }

  getPeriodsEntityList() {
    return this.apiService.mainApiPost<string[]>(['appUser'], 'AppClass', 'getEntityList').pipe(
      map(ids => ids.map(id => +id))
    );
  }

  getCategoryEntityList(categoryId: number) {
    return this.apiService.mainApiPost<{e_id: number, e_uniqueNo: string}[] | string[]>([categoryId, 'appUser'], 'PricingTestConsole', 'getEntityList');
  }

  getServiceTypeForPeriod(eId: number, arrivalDate: string, nightsStay: number, localId: number, dbName: string) {
    return this.apiService.mainApiPost<ServiceTypeForPeriod[]>([eId, arrivalDate, nightsStay, localId, dbName], 'PricingBEFE', 'getServiceTypeForPeriod');
  }

  getMinMaxPersons(eId: number, arrivalDate: string, dbName: string) {
    return this.apiService.mainApiPost<MinMaxPersons>([eId, arrivalDate, dbName], 'PricingBEFE', 'getMinMaxPersons');
  }

  getPricingForBEFE(
    eId: number,
    arrivalDate: string,
    nightsStay: number,
    adults: number,
    children: number,
    birthDates: string,
    smallPets: number,
    largePets: number,
    catering: string,
    cots: number,
    garages: number,
    dbName: string
  ) {
    return this.apiService.mainApiPost<PricingForBEFE>(
      [eId, arrivalDate, nightsStay, adults, children, birthDates, smallPets, largePets, catering, cots, garages, 'en_GB', dbName],
      'PricingBEFE',
      'getPricingForBEFE'
    );
  }

  setBookingCalendar(roomId: number, period: SeasonPeriod) {
    return this.apiService.mainApiPost([
      roomId, dayjs(period.fromDate).format('YYYY-MM-DD'), dayjs(period.untilDate).format('YYYY-MM-DD'), 'appUser'
    ], 'AppClass', 'setBookingCalendar');
  }

  getRoomCategories(preselectRoomId?: number): Observable<RoomCategory[]> {
    const parameters: any[] = ['appUser'];
    if (preselectRoomId !== undefined) {
      parameters.push(preselectRoomId);
    }
    return this.apiService.mainApiPost<RawRoomCategory[]>(
      parameters,
      'EntityGroup',
      'getEntityGroup'
    ).pipe(
      // https://trello.com/c/JQsUGVMy/74-room-admin-room-category-part-1 (3)
      map(list => {
        const unique = _.uniqBy(list, (c: RawRoomCategory) => c.eg_id);
        const groups = _.groupBy(list, (c: RawRoomCategory) => c.eg_id);

        return unique.map(category => reduceRoomCategory(category, groups[category.eg_id]));
      })
    );
  }

  getLinkedRooms(id: number): Observable<{ uniqueNo: string }[]> {
    return this.apiService.mainApiPost<['NONE'] | { e_uniqueNo: string }[]>([id, 'appUser'], 'EntityGroup', 'getLinkedEntities').pipe(
      map(resp => resp[0] === 'NONE' ? [] : (resp as any).map(r => ({ uniqueNo: r.e_uniqueNo })))
    );
  }

  deleteCategory(id: number) {
    return this.apiService.mainApiPost([id, 'appUser'], 'EntityGroup', 'deleteEntityGroup');
  }

  insertCategory(name: string) {
    return this.apiService.mainApiPost([{ eg_name: name }, 'appUser'], 'EntityGroup', 'insertEntityGroup');
  }

  saveCategory(c: RoomCategory) {
    return this.apiService.mainApiPost([prepareCategoryBody(c), 'appUser'], 'EntityGroup', 'adminEntityGroup');
  }

  getPricingSchemes(): Observable<PricingScheme[]> {
    return this.apiService.mainApiPost<RawPricingScheme[]>(['appUser'], 'EntitySeasonPeriod', 'getPricingScheme').pipe(
      map(list => list.map(reducePricingScheme))
    );
  }

  getPricing(source: PricingSource, seasonPeriodId: number) {
    const [sourceId, entityId] = source.type === 'category' ? [source.id, 0] : [0, source.id];

    return this.apiService.mainApiPost<RawPricing>([sourceId, entityId, seasonPeriodId, 'appUser'], 'EntitySeasonPeriod', 'getPricing').pipe(
      map(raw => reducePricing(raw))
    );
  }

  savePricing(seasonPeriodId: SeasonPeriod['id'], source: PricingSource, forAll: boolean, pricing: Pricing) {
    const rawPricing = preparePricingBody(pricing);

    return this.apiService.mainApiPost([{
      sp_id: seasonPeriodId,
      eg_id: source.type === 'category' ? source.id : 0,
      e_id: source.type === 'apartment' ? source.id : 0,
      ...rawPricing,
      pricing: rawPricing.seasonPeriodEntityPrice,
      updateForAllEntitiesOfThisGroup: forAll
    }, 'appUser'], 'EntitySeasonPeriod', 'adminPricing');
  }

  getActiveServiceType(): Observable<ServiceType[]> {
    return this.apiService.mainApiPost<RawServiceType[]>(['appUser'], 'AppClass', 'getActiveServiceType').pipe(
      map(list => list.map(reduceServiceType))
    );
  }

  resetAgeGroup(seasonPeriodId: SeasonPeriod['id'], source: PricingSource) {
    return this.apiService.mainApiPost([{
       sp_id: seasonPeriodId,
       eg_id: source.type === 'category' ? source.id : 0,
       e_id: source.type === 'apartment' ? source.id : 0
    }, 'appUser'], 'EntitySeasonPeriod', 'resetAgeGroups');
  }

  getEntityGroupLight() {
    return  this.apiService.mainApiPost<{ eg_id: string; eg_name: string }[]>(['appUser'], 'EntitySeasonPeriod',  'getEntityGroup').pipe(
      map(response => response.map(item => ({ id: item.eg_id, name: item.eg_name })))
    );
  }

  getActiveRooms() {
    return  this.apiService.mainApiPost<{ e_id: string; e_uniqueNo: string }[]>(['appUser'], 'EntitySeasonPeriod',  'getEntityList').pipe(
      map(response => response.map(item => ({ id: +item.e_id, name: item.e_uniqueNo })))
    );
  }

  copyRoomCategoryTo(periodId: SeasonPeriod['id'], categoryId: RoomCategory['id'], information: CopyToId[], categoryIds: CopyToId[], periodIds: CopyToId[]) {
    return this.apiService.mainApiPost([{
      sourceSPID: periodId,
      sourceEGID: categoryId,
      dataArr: information,
      egArr: categoryIds,
      spArr: periodIds
   }, 'appUser'], 'EntitySeasonPeriod', 'copyTo');
  }

  copyRoomTo(periodId: SeasonPeriod['id'], apartmentId: ApartmentDetail['id'], information: CopyToId[], roomIds: CopyToId[], periodIds: CopyToId[]) {
    return this.apiService.mainApiPost([{
      sourceSPID: periodId,
      sourceEID: apartmentId,
      eArr: roomIds,
      dataArr: information,
      spArr: periodIds
   }, 'appUser'], 'EntitySeasonPeriod', 'copyEntityTo');
  }

  copyGuestTo(sourceId: number, fields: CopyToId[], personIds: CopyToId[]) {
    return this.apiService.mainApiPost([{
      fields: fields.join(','),
      source_cbrf_id: sourceId,
      copyTo: personIds.join(',')
   }, 'appUser'], 'registrationForm', 'guestCopyTo');
  }

  getPricesConfig(source: PricingSource, periodId: SeasonPeriod['id']) {
    const funcName = source.type === 'category' ? 'getSeasonPeriodEntityGroup' : 'getSeasonPeriodEntity';

    return  this.apiService.mainApiPost([source.id, periodId, 'appUser'], 'EntitySeasonPeriod', funcName).pipe(
      map(reducePricingConfig)
    );
  }

  savePricesConfig(config: PricingConfig, source: PricingSource) {
    return  this.apiService.mainApiPost([preparePricingConfigBody(config, source), 'appUser'], 'EntitySeasonPeriod',  'updateEntitySeasonPeriod');
  }

  ////

  getPictures(categoryId: RoomCategory['id'], source: PictureSource) {
    const [className, funcName] = pictureSources[source]('get');

    return  this.apiService.mainApiPost<(RawCategoryPictureEntity | RawApartmentPictureEntity)[]>([categoryId, 'appUser'], className, funcName).pipe(
      map(list => list.map(source === 'category' ? reduceCategoryPicture : reduceApartmentPicture))
    );
  }

  updatePicture(picture: PictureEntity, source: PictureSource) {
    const [className, funcName] = pictureSources[source]('update');

    return  this.apiService.mainApiPost([
      source === 'category' ? prepareCategoryPictureBody(picture) : prepareApartmentPictureBody(picture), 'appUser'
    ], className,  funcName);
  }

  deletePicture(pictureId: PictureEntity['id'], source: PictureSource) {
    const [className, funcName] = pictureSources[source]('delete');

    return  this.apiService.mainApiPost([pictureId, 'appUser'], className,  funcName);
  }

  uploadPicture(id: RoomCategory['id'] | RoomListItem['id'], file: File, db: string, source: PictureSource) {
    const formData = new FormData();
    const date = new Date();
    const idProps: {[key in typeof source]: string } = {
      category: 'eg_id',
      apartment: 'e_id'
    };
    const imageTypes: {[key in typeof source]: string } = {
      category: 'entityGroupImage',
      apartment: 'entityImage'
    };

    formData.append('dbName', db);
    formData.append('filename', file.name);
    formData.append('imageType', imageTypes[source]);
    formData.append('timeStamp', `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`);
    formData.append(idProps[source], String(id));
    formData.append('Filedata', file);

    return this.apiService.uploadApiPost(formData, FileUploadType.Image);
  }

  ///

  getWebsitePictures(source: WebsitePictureSource): Observable<PictureEntity[]> {
    return  this.apiService.mainApiPost<RawWebsitePicture[]>([source, 'appUser'], 'cms', 'getCmsPic').pipe(
      map(list => list.map(reduceWebsitePicture))
    );
  }

  updateWebsitePicture(picture: PictureEntity, source: WebsitePictureSource): Observable<number[]> {
    return  this.apiService.mainApiPost([{
      ci_id: picture.id,
      ci_tag: picture.tag || '',
      ci_sortOrder: picture.sortOrder
    }, 'appUser'], 'cms',  'updateCmsPic');
  }

  deleteWebsitePicture(pictureId: PictureEntity['id'], source: WebsitePictureSource): Observable<void> {
    return this.apiService.mainApiPost([pictureId, 'appUser'], 'cms',  'deleteCmsPic');
  }

  uploadWebsitePicture(source: WebsitePictureSource, file: File, db: string): Observable<string> {
    const formData = new FormData();
    const date = new Date();

    formData.append('dbName', db);
    formData.append('imageType', 'cmsImage');
    formData.append('timeStamp', `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`);
    formData.append('tagName', source === 'logo' ? '___logo___' : '');
    formData.append('whichOne', source);
    formData.append('Filedata', file);

    return this.apiService.uploadApiPost(formData, FileUploadType.Image);
  }

  ///

  uploadLayoutPicture(id: RoomCategory['id'] | RoomListItem['id'], file: File, db: string, source: LayoutSource) {
    const formData = new FormData();
    const date = new Date();
    const idProps: {[key in typeof source]: string } = {
      categoryLayout: 'eg_id',
      apartmentLayout: 'e_id'
    };
    const imageTypes: {[key in typeof source]: string } = {
      categoryLayout: 'entityGroupThumbSketch',
      apartmentLayout: 'entityThumbSketch'
    };

    formData.append('dbName', db);
    formData.append('filename', file.name);
    formData.append('imageType', imageTypes[source]);
    formData.append('timeStamp', `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`);
    formData.append(idProps[source], String(id));
    formData.append('Filedata', file);

    return this.apiService.uploadApiPost(formData, FileUploadType.Image);
  }

  getPictureCategories(roomCategoryId: RoomCategory['id']): Observable<{ id: number, name: string }[]> {
    return  this.apiService.mainApiPost<{ eg_id: string, eg_name: string }[]>([
      roomCategoryId, 'appUser'
    ], 'EntityGroupPic',  'getEntityGroup').pipe(
      map(list => list.map(item => ({ id: +item.eg_id, name: item.eg_name })))
    );
  }

  getPicturesRooms(): Observable<string[]> {
    return  this.apiService.mainApiPost<{ e_uniqueNo: string }[]>(['appUser'], 'EntityGroupPic',  'getEntity').pipe(
      map(list => list.map(item => item.e_uniqueNo))
    );
  }

  copyPicture(roomCategoryId: RoomCategory['id'], categoryIds: CopyToId[], roomIds: CopyToId[]) {
    return this.apiService.mainApiPost([{
        egArr: categoryIds,
        eArr: roomIds,
        source_eg_id: roomCategoryId
      }, 'appUser'], 'EntityGroupPic',  'copyPictures');
  }

  getFeatures(roomCategoryId: RoomCategory['id']): Observable<RawFeature> {
    return  this.apiService.mainApiPost([roomCategoryId, 'appUser'], 'EntityGroup',  'getEntityGroupFeatures');
  }

  getRoomTypes(): Observable<RoomType[]> {
    return  this.apiService.mainApiPost<{ et_id: string, et_name: string }[]>(['appUser'], 'EntityGroup',  'getEntityType').pipe(
      map(list => list.map(item => ({ id: +item.et_id, name: item.et_name })))
    );
  }

  saveFeatures(id: number, roomTypeId: number, body: RawFeature, forAll: boolean) {
    return  this.apiService.mainApiPost([{
      ...body,
      eg_id: id,
      eg_entityType_id: roomTypeId,
      forAll: forAll ? 'on' : 'off'
    }, 'appUser'], 'EntityGroup',  'updateEntityGroupFeatures');
  }

  copyFeatures(roomCategoryId: RoomCategory['id'], categoryIds: CopyToId[], roomIds: CopyToId[]) {
    return this.apiService.mainApiPost([{
        egArr: categoryIds,
        eArr: roomIds,
        source_eg_id: roomCategoryId
      }, 'appUser'], 'EntityGroup',  'copyFeatures');
  }

  loadLayoutImage(roomCategoryId: RoomCategory['id'] | RoomListItem['id'], source: LayoutSource) {
    const idProp = source === 'categoryLayout' ? 'eg_id' : 'e_id';
    const [className, funcName] = source === 'categoryLayout' ?  ['EntityGroup',  'getImage'] : ['EntityType', 'getImageThumbsketch'];

    return this.apiService.mainApiPost<[string]>([{ [idProp]: roomCategoryId }, 'appUser'], className, funcName).pipe(
      map(([url]) => url)
    );
  }

  removeImage(roomCategoryId: RoomCategory['id'] | RoomListItem['id'], source: LayoutSource) {
    const idProp = source === 'categoryLayout' ? 'eg_id' : 'e_id';
    const [className, funcName] = source === 'categoryLayout' ?  ['EntityGroup',  'clearImage'] : ['EntityType', 'clearImageThumbsketch'];

    return this.apiService.mainApiPost([{ [idProp]: roomCategoryId }, 'appUser'], className, funcName);
  }

  getRoomsAndApartments(): Observable<RoomListItem[]> {
    return this.apiService.mainApiPost<{ e_id: string, e_sortOrder: string, e_uniqueNo: string, isSeparator: string }[]>(
      ['StandardRoomAndAppartment', 'appUser'], 'EntityType', 'getListOfEntityType'
    ).pipe(
      map(list => list.map(item => ({
          id: +item.e_id,
          sortOrder: item.e_sortOrder,
          uniqueNo: item.e_uniqueNo,
          isSeparator: item.isSeparator === 'on'
        })
      ))
    );
  }

  putSeparator(id: RoomListItem['id'], sortOrder: number) {
    return this.apiService.mainApiPost([{ es_id: id, es_sortOrder: sortOrder }, 'appUser'], 'EntityType',  'setEntitySeparator');
  }

  validateRooms(roomTypeId: RoomType['id'], rooms: ApartmentRoom[]) {
    return this.apiService.mainApiPost<RawRoomsValidationResponse>([
      prepareRoomsBody(roomTypeId, rooms), 'appUser'
    ], 'EntityType',  'validateNumberOfRooms').pipe(
      map(reduceValidation)
    );
  }

  insertRooms(roomTypeId: RoomType['id'], rooms: ApartmentRoom[]) {
    return this.apiService.mainApiPost([prepareRoomsBody(roomTypeId, rooms), 'appUser'], 'EntityType', 'insertEntity');
  }

  sendEmailAboutRoomLicense(maxRooms?: number, currentRooms?: number) {
    return this.apiService.mainApiPost([maxRooms, currentRooms, 'appUser'], 'EntityType', 'sendEmailAboutRoomLicense');
  }

  checkBeforeRoomDeletion(roomId: RoomListItem['id'], roomNo: RoomListItem['uniqueNo']) {
    return this.apiService.mainApiPost<{ msg: 'OK' | 'BOOKINGS_IN_FUTURE' }>([roomId, roomNo, 'appUser'], 'EntityType', 'checkBeforeEntityDeletion').pipe(
      map(resp => ({ status: resp.msg }))
    );
  }

  deleteApartmentsSeparator(id: number) {
    return this.apiService.mainApiPost([id, 'appUser'], 'EntityType', 'deleteEntitySeparator');
  }

  deleteApartment(id: number) {
    return this.apiService.mainApiPost([id, 'appUser'], 'EntityType', 'deleteEntity');
  }

  getApartmentDetail(id: number) {
    return this.apiService.mainApiPost<RawApartmentDetail>([id, 'appUser'], 'EntityType', 'getEntityDetail').pipe(
      map(reduceApartmentDetail)
    );
  }

  validateApartmentDetail(id: number, adminOnly: boolean) {
    return this.apiService.mainApiPost<RawRoomsValidationResponse>([{
      e_adminOnly: adminOnly ? 'on' : 'off', e_id: id
    }, 'appUser'], 'EntityType', 'validateAdminOnlyChange').pipe(
      map(reduceValidation)
    );
  }

  saveApartmentDetail(detail: ApartmentDetail) {
    return this.apiService.mainApiPost([prepareApartmentBody(detail), 'appUser'], 'EntityType', 'updateEntity').pipe(
      map(reduceValidation),
    );
  }

  getApartmentDescriptions(id: number): Observable<ApartmentDescription[]> {
    return this.apiService.mainApiPost<{
      el_entity_id: number;
      el_locale_id: number;
      el_shortDesc: string;
      el_longDesc: string;
    }[]>([id, 'appUser'], 'EntityType', 'getEntityLongDesc').pipe(
      map(list => list.map(item => ({
        localeId: +item.el_locale_id,
        description: item.el_longDesc
      })))
    );
  }

  saveApartmentDescriptions(id: number, descriptions: ApartmentDescription[]) {
    return this.apiService.mainApiPost([{
      e_id: id,
      ldls: descriptions.map(d => ({
        el_locale_id: d.localeId,
        el_longDesc: d.description
      }))
    }, 'appUser'], 'EntityType', 'setEntityLongDesc').pipe(
      map(reduceValidation),
    );
  }

  resetToCategoryPicture(id: number) {
    return this.apiService.mainApiPost([id, 'appUser'], 'EntityPic', 'resetRoomPicsFromCat');
  }

  resetApartment(id: ApartmentDetail['id'], seasonPeriodId: SeasonPeriod['id']) {
    return this.apiService.mainApiPost([{ sp_id: seasonPeriodId, e_id: id }, 'appUser'], 'EntitySeasonPeriod', 'resetToEntityGroup');
  }

  getCharges(): Observable<ExtraCharge[]> {
    return this.apiService.mainApiPost<RawExtraCharge[]>(['appUser'], 'Other', 'getOther').pipe(
      map(list => list.map(reduceCharge))
    );
  }

  getChargeDetails(id: ExtraCharge['id']): Observable<ExtraChargeDetails> {
    return this.apiService.mainApiPost<RawExtraChargeDetails>([id, 'appUser'], 'Other', 'getOtherChargeDetail').pipe(
      map(reduceChargeDetails)
    );
  }

  saveChargeDetails(charge: ExtraChargeRequestBody) {
    return this.apiService.mainApiPost<RawExtraChargeDetails>([prepareExtraChargeBody(charge), 'appUser'], 'Other', 'setOther');
  }

  getAgeGroups(): Observable<AgeGroup[]> {
    return this.apiService.mainApiPost<RawAgeGroup[]>(['appUser'], 'AgeGroups', 'getAgeGroup').pipe(
      map(list => list.map(reduceAgeGroup))
    );
  }

  saveAgeGroup(group: AgeGroup): Observable<number | null> {
    return this.apiService.mainApiPost<number[]>(
      [prepareAgeGroup(group), 'appUser'],
      'AgeGroups',
      'adminAgeGroup'
    ).pipe(map(ids => ids && ids.length ? ids[0] : null));
  }

  deleteAgeGroup(groupId: AgeGroup['id']) {
    return this.apiService.mainApiPost([groupId, 'appUser'], 'AgeGroups', 'deleteAgeGroup');
  }

  resetAgeGroups() {
    return this.apiService.mainApiPost(['appUser'], 'AgeGroups', 'resetAgeGroups');
  }

  getLastMinutes(): Observable<LastMinutes> {
    return this.apiService.mainApiPost<RawLastMinutes>(['appUser'], 'LastMinute', 'getLastMinutes').pipe(
      map(reduceLastMinutes)
    );
  }

  setLastMinutesActive(active: boolean) {
    return this.apiService.mainApiPost<RawLastMinutes>([active ? 'on' : 'off', 'appUser'], 'LastMinute', 'setLastMinutesEnabled');
  }

  deleteLastMinutesItem(id: LastMinutesItem['id']) {
    return this.apiService.mainApiPost<RawLastMinutes>([id, 'appUser'], 'LastMinute', 'deleteLastMinute');
  }

  saveLastMinutesItem(body: LastMinutesItemBody) {
    return this.apiService.mainApiPost<RawLastMinutes>([prepareLastMinutesBody(body), 'appUser'], 'LastMinute', 'adminLastMinute');
  }

  getLastMinutesTranslation(id: LastMinutesItem['id'], localeId: number) {
    return this.apiService.mainApiPost<RawLastMinutes>([{ lm_id: id, lml_locale_id: localeId }, 'appUser'], 'LastMinute', 'getLocale').pipe(
      map(resp => resp[0])
    );
  }

  getLongStayDiscount(): Observable<Discount[]> {
    return this.apiService.mainApiPost<RawLongStayDiscount[]>(['appUser'], 'LongStayDiscount', 'getLongStayDiscount').pipe(
      map(list => list.map(v => reduceDiscount(v, 'lsd')))
    );
  }

  saveLongStayDiscount(item: Discount) {
    return this.apiService.mainApiPost([prepareLongStayDiscountBody(item), 'appUser'], 'LongStayDiscount', 'adminLongStayDiscount');
  }

  deleteLongStayDiscount(id: Discount['id']) {
    return this.apiService.mainApiPost([id, 'appUser'], 'LongStayDiscount', 'deletelongStayDiscount');
  }

  getLongStayDiscountDetail(id: Discount['id']): Observable<LongStayDiscountDetail> {
    return this.apiService.mainApiPost([id, 'appUser'], 'LongStayDiscount', 'getLongStayDiscountDetail').pipe(
      map(reduceLongStayDiscountDetail)
    );
  }

  getLongStayDiscountTranslation(localeId: number, id: Discount['id']): Observable<string> {
    return this.apiService.mainApiPost<[string]>([{ lsdrl_locale_id: localeId, lsdr_id: id }, 'appUser'], 'LongStayDiscount', 'getLocale').pipe(
      map(resp => resp[0])
    );
  }

  saveLongStayDiscountRate(rate: LongStayDiscountRate): Observable<number/* id */> {
    return this.apiService.mainApiPost<[any]>([prepareLongStayRateBody(rate), 'appUser'], 'LongStayDiscount', 'adminLongStayDiscountRate').pipe(
      map(resp => +resp[0])
    );
  }

  deleteLongStayDiscountRate(id: LongStayDiscountRate['id']) {
    return this.apiService.mainApiPost([id, 'appUser'], 'LongStayDiscount', 'deletelongStayDiscountRate');
  }

  getEarlyBirdDiscount(): Observable<Discount[]> {
    return this.apiService.mainApiPost<RawEarlyBirdDiscount[]>(['appUser'], 'EarlyBirdDiscount', 'getEarlyBirdDiscount').pipe(
      map(list => list.map(v => reduceDiscount(v, 'ebd')))
    );
  }

  getEarlyBirdDiscountDetail(id: Discount['id'], localeId: number): Observable<EarlyBirdDiscountDetail> {
    return this.apiService.mainApiPost<RawEarlyBirdDiscountDetail>([{ ebd_id: id, ebdl_locale_id: localeId }, 'appUser'], 'EarlyBirdDiscount', 'getEarlyBirdDiscountDetail').pipe(
      map(resp => reduceEarlyBirdDiscountDetail({ ...resp, ebdl_locale_id: String(localeId) }))
    );
  }

  saveEarlyBirdDiscount(discount: EarlyBirdDiscountDetail): Observable<number/* id */> {
    return this.apiService.mainApiPost<[string]>([prepareEarlyBirdDiscountBody(discount), 'appUser'], 'EarlyBirdDiscount', 'adminEarlyBirdDiscount').pipe(
      map(resp => +resp[0])
    );
  }

  deleteEarlyBirdDiscountRate(id: EarlyBirdDiscountDetail['id']) {
    return this.apiService.mainApiPost([id, 'appUser'], 'EarlyBirdDiscount', 'deleteEarlyBirdDiscount');
  }

  feratelImport(customerId: number, sugarId: string, file: File) {
    const formData = new FormData();
    const identified = Date.now();

    formData.append('uploadType', 'backendUpload');
    formData.append('Item', 'dummy');
    formData.append('backEndToken', String(identified));
    formData.append('Filedata', file);

    return this.apiService.reportApiPost(customerId, sugarId, formData).pipe(
      concatMap(() => this.apiService.mainApiPost<['SUCCESS' | 'ERROR']>([identified, 'appUser'], 'CompanyCustomerAdmin', 'checkGuestImport')),
      concatMap(resp => resp[0] === 'SUCCESS' ? of(identified) : throwError('Import failed'))
    );
  }

  getCustomerFormResources(): Observable<CustomerFormResources> {
    return this.apiService.mainApiPost<RawCustomerFormResources>(['appUser'], 'registrationForm', 'getDropdownBoxes').pipe(
      map(reduceCustomerFormResources)
    );
  }

  getMergeGuestCustomersDetail(firstCustomerId: number, secondCustomerId: number): Observable<[Customer, Customer]> {
    return this.apiService.mainApiPost<[RawCustomer, RawCustomer]>([{
      c_id_1: firstCustomerId,
      c_id_2: secondCustomerId
    }, 'appUser'], 'CompanyCustomerDetail', 'getMergeCustomerDetails').pipe(
      map(resp => ([reduceCustomer(resp[0]), reduceCustomer(resp[1])]))
    );
  }

  mergeGuestProfiles(customer1: Customer, customer2: Customer) {
    return this.apiService.mainApiPost([prepareCustomerBody(customer1, customer2), 'appUser'], 'CompanyCustomerDetail', 'mergeCustomers');
  }

  getCustomerRating(customerId: Customer['id'], dbName: string) {
    return this.apiService.mainApiPost<RawCustomerRating | []>([customerId, dbName], 'CompanyCustomerReview', 'getEBReview').pipe(
      map(resp => reduceCustomerRating(Array.isArray(resp) ? undefined : resp))
    );
  }

  saveCustomerRating(customerId: Customer['id'], rating: CustomerRating, dbName: string) {
    return this.apiService.mainApiPost<RawCustomerRating | []>([customerId, prepareRatingBody(rating), dbName], 'CompanyCustomerReview', 'setEBReview').pipe(
      map(resp => reduceCustomerRating(Array.isArray(resp) ? undefined : resp))
    );
  }

  saveBookingGuest(customer: Customer) {
    return this.apiService.mainApiPost([prepareBookingGuestBody(customer), 'appUser', customer.id], 'registrationForm', 'saveBookingGuest');
  }

  saveBookingGuestDetail(guest: GuestDetail) {
    return this.apiService.mainApiPost([prepareBookingGuestDetailBody(guest), 'appUser'], 'registrationForm', 'saveBookingGuest');
  }

  getBookingGuest(customerId: Customer['id']): Observable<GuestDetail> {
    return this.apiService.mainApiPost<RawGuestDetail[]>([null, 'appUser', null, customerId], 'registrationForm', 'getBookingGuests').pipe(
      map(resp => reduceGuestDetail(resp[0]))
    );
  }

  getBookingGuests(bookingId: number | null, notLinked?: boolean, customerId?: number | null, hotelRecordId?: number): Observable<GuestDetail[]> {
    return this.apiService.mainApiPost<RawGuestDetail[]>([
      bookingId, 'appUser',
      notLinked === undefined ? null : (notLinked ? 'on' : 'off'),
      customerId,
      hotelRecordId
    ], 'registrationForm', 'getBookingGuests').pipe(
      map(resp => resp.map(reduceGuestDetail))
    );
  }

  getCompanyCustomerBooking(customerId: Customer['id'], showDeleted: boolean): Observable<CustomerBooking[]> {
    return this.apiService.mainApiPost<RawCustomerBooking[]>([customerId, showDeleted, 'appUser'], 'CompanyCustomerBooking', 'getCompanyCustomerBooking').pipe(
      map(resp => resp.map(reduceCustomerBooking))
    );
  }

  getBookingRooms(bookingId: number): Observable<BookingRoom[]> {
    return this.apiService.mainApiPost<RawBookingRoom[]>([bookingId, 'appUser'], 'CompanyCustomerBooking', 'getBookingEntityDetail').pipe(
      map(list => list.map(reduceBookingRooom))
    );
  }

  getBookingChargeTranslation(): Observable<string> {
    return this.apiService.mainApiPost(['appUser'], 'AppClass', 'getOtherChargesLocale');
  }

  getBookingDetail(bookingId: number): Observable<BookingDetail> {
    return this.apiService.mainApiPost<RawBookingDetail>([bookingId, 'appUser'], 'CompanyCustomerBooking', 'getBookingDetail').pipe(
      map(reduceBookingDetail)
    );
  }

  getBookingGuestDetail(bookingId: number): Observable<GuestRelatedDetail> {
    return this.apiService.mainApiPost<RawGuestRelatedDetail>([bookingId, 'appUser'], 'CompanyCustomerBooking', 'getGtcDetails').pipe(
      map(reduceGuestRelatedDetail)
    );
  }

  getPCIInfo(token: string, fromChannelManager: boolean): Observable<{ useCCProxy: boolean; count: number }> {
    return this.apiService.mainApiPost<{ c_useCCProxy: '0' | '1'; cc_numDataRequested: string; }>([token, 'appUser'], 'CompanyCustomerBooking', fromChannelManager ? 'getPCIInfoFromCM' : 'getPCIInfo').pipe(
      map(item => ({ useCCProxy: +item.c_useCCProxy === 1, count: +item.cc_numDataRequested }))
    );
  }

  increasePCICounter(token: string, fromChannelManager: boolean) {
     return this.apiService.mainApiPost([token, 'appUser'], 'CompanyCustomerBooking', fromChannelManager ? 'increasePCICounterFromCM' : 'increasePCICounter');
  }

  getChargingSchemes(): Observable<ChargingScheme[]> {
    return this.apiService.mainApiPost<RawChargingScheme[]>(['appUser'], 'ChargingScheme', 'getChargingSchemeList').pipe(
      map(list => list.map(reduceChargingScheme))
    );
  }

  getChargingSchemeDetail(id: ChargingScheme['id']): Observable<ChargingSchemeDetail<AnyChargingScheme>> {
    return this.apiService.mainApiPost<RawChargingScheme>([id, 'appUser'], 'ChargingScheme', 'getActiveChargingSchemeDetail').pipe(
      map(reduceChargingSchemeDetail)
    );
  }

  getActiveChargingSchemes(): Observable<ChargingSchemeTypeRecord[]> {
    return this.apiService.mainApiPost<{ cs_id: string; cs_name: CateringSchemeType; csl_name: string; }[]>(['appUser'], 'ChargingScheme', 'getActiveChargingSchemeList').pipe(
      map(list => list.map(item => ({ id: +item.cs_id, value: item.cs_name, name: item.csl_name })))
    );
  }

  copyChargingScheme(id: ChargingScheme['id']) {
    return this.apiService.mainApiPost([id, 'appUser'], 'ChargingScheme', 'copyActiveChargingScheme');
  }

  deleteChargingScheme(id: ChargingScheme['id']) {
    return this.apiService.mainApiPost([ {
      action: 'delete',
      acs_id: id
    }, 'appUser'], 'ChargingScheme', 'adminActiveChargingScheme');
  }

  saveChargingScheme(body: ChargingSchemeBody<ChargingSchemeDetail<AnyChargingScheme>>, baseId?: number/* type id from getActiveChargingSchemes, required to insert a new scheme */): Observable<number | null> {
    const extra = body.id ? { action: 'update' } : { acs_chargingScheme_id: String(baseId) };

    return this.apiService.mainApiPost<[string]>(
      [
        {
          ...extra,
          ...prepareChargingSchemeBody(body)
        },
        'appUser'
      ],
      'ChargingScheme',
      body.id ? 'adminActiveChargingScheme' : 'insertCS'
    ).pipe(
      map(values => {
        if (values && values.length > 0) {
          return +values[0];
        }
        return null;
      })
    );
  }

  getChargingSchemeLinkedCategories(id: ChargingScheme['id']): Observable<ChargingSchemeLinkedCategory[]> {
    return this.apiService.mainApiPost<{ eg_id: string; eg_name: string; checked: Trigger; }[]>([id, 'appUser'], 'ChargingScheme', 'getLinkedCategories').pipe(
      map(list => list.map(item => ({ id: +item.eg_id, name: item.eg_name, checked: item.checked === 'on' })))
    );
  }

  setChargingSchemeLinkedCategories(id: ChargingScheme['id'], categories: ChargingSchemeLinkedCategory[]) {
    return this.apiService.mainApiPost([id, categories.map(c => ({
      eg_id: String(c.id),
      checked: c.checked ? 'on' : 'off'
    })), 'appUser'], 'ChargingScheme', 'setLinkedCategories');
  }

  getEmailTemplates(type: EmailTemplateType): Observable<EmailTemplate[]> {
    return this.apiService.mainApiPost<RawEmailTemplate[]>([type, 'appUser'], 'EMailTemplateAdmin', 'getEMailReason').pipe(
      map(list => list.map(reduceEmailTemplate))
    );
  }

  getSpecificSeasonPeriodsIdForEmailTemplate(id: EmailTemplate['id'], localeId: number): Observable<number[]> {
    return this.apiService.mainApiPost<{ sp_id: string; etlSPID: Trigger }[]>([id, localeId, 'appUser'], 'EMailTemplateAdmin', 'getEMailTemplateSeasonPeriod').pipe(
      map(list => list
        .map(item => ({ id: +item.sp_id, specific: item.etlSPID === 'on' }))
        .filter(item => item.specific)
        .map(item => item.id)
      )
    );
  }

  getEmailTemplateDetail(id: EmailTemplate['id'], localeId: number, seasonId?: number): Observable<EmailTemplateDetail> {
    return this.apiService.mainApiPost<RawEmailTemplateDetail>([id, localeId, seasonId || 0, 'appUser'], 'EMailTemplateAdmin', 'getEMailTemplateDetail').pipe(
      map(obj => reduceEmailTemplateDetail(obj, id, localeId, seasonId || 0))
    );
  }

  saveEmailTemplateDetail(detail: EmailTemplateDetail, pdfSource = false) {
    return this.apiService.mainApiPost([prepareEmailTemplateDetailBody(detail), 'appUser', pdfSource], 'EMailTemplateAdmin', 'adminEMailTemplateLocale');
  }

  useEmailTemplateAsDefault(id: EmailTemplate['id'], periodId: number, localeId: number) {
    return this.apiService.mainApiPost([{
      etl_seasonPeriod_id: periodId,
      etl_emailReason_id: id,
      etl_locale_id: localeId
    }, 'appUser'], 'EMailTemplateAdmin', 'deleteSPTemplate');
  }

  useImageTemplateAsDefault(id: EmailTemplate['id'], periodId: number, localeId: number) {
    return this.apiService.mainApiPost([{
      itl_seasonPeriod_id: periodId,
      itl_emailReason_id: id,
      itl_locale_id: localeId
    }, 'appUser'], 'EMailTemplateAdmin', 'deleteImageTemplateLocale');
  }

  getEmailTemplateImages(id: EmailTemplate['id'], localeId: number, seasonId?: number): Observable<EmailTemplateImages | undefined> {
    return this.apiService.mainApiPost<RawEmailTemplateImages>([id, localeId, seasonId || 0, 'appUser'], 'EMailTemplateAdmin', 'getImageTemplateLocale').pipe(
      map(resp => Array.isArray(resp) ? undefined : reduceEmailTemplateImages(resp))
    );
  }

  uploadEmailTemplatePicture(id: EmailTemplate['id'], file: File, source: keyof EmailTemplateImages, db: string, localeId: number, seasonId?: number) {
    const formData = new FormData();
    const date = new Date();
    const imageTypes: {[key in keyof EmailTemplateImages]: string} = {
      headerImage: 'etl_itl_headerImage',
      image: 'etl_itl_Image575',
      footerImage: 'etl_itl_footerImage'
    };

    formData.append('dbName', db);
    formData.append('Filename', file.name);
    formData.append('itl_emailReason_id', String(id));
    formData.append('itl_locale_id', String(localeId));
    formData.append('itl_seasonPeriod_id', String(seasonId || 0));
    formData.append('imageType', imageTypes[source] as string);
    formData.append('timeStamp', `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`);
    formData.append('Filedata', file);

    return this.apiService.uploadApiPost(formData, FileUploadType.Image);
  }

  clearEmailTemplateImage(id: EmailTemplate['id'], source: keyof EmailTemplateImages, localeId: number, seasonId?: number) {
    const imageTypes: {[key in keyof EmailTemplateImages]: string} = {
      headerImage: 'itl_headerImage',
      image: 'itl_Image575',
      footerImage: 'itl_footerImage'
    };

    return this.apiService.mainApiPost([imageTypes[source], {
      itl_locale_id: String(localeId),
      itl_seasonPeriod_id: String(seasonId || 0),
      itl_emailReason_id: String(id)
    }, 'appUser'], 'EMailTemplateAdmin', 'clearImage');
  }

  copyDefaultEmailTemplateImages(id: EmailTemplate['id'], localeId: number, seasonId?: number) {
    return this.apiService.mainApiPost([{
      itl_locale_id: String(localeId),
      itl_seasonPeriod_id: String(seasonId || 0),
      itl_emailReason_id: String(id)
    }, 'appUser', true], 'EMailTemplateAdmin', 'copyDefaultImages');
  }

  copyToEmailTemplateImages(id: EmailTemplate['id'], source: keyof EmailTemplateImages, ids: { templateIds: CopyToId[], localIds: CopyToId[], periodIds: CopyToId[] }, localeId: number, seasonId?: number) {
    const imageTypes: {[key in keyof EmailTemplateImages]: string} = {
      headerImage: 'itl_headerImage',
      image: 'itl_Image575',
      footerImage: 'itl_footerImage'
    };

    return this.apiService.mainApiPost([{
      seasonPeriodArray: ids.periodIds,
      localeArray: ids.localIds,
      emailReasonArray: ids.templateIds
    },
    {
      sp_id: seasonId || 0,
      l_id: localeId,
      er_id: id
    }, imageTypes[source], 'appUser'], 'EMailTemplateAdmin', 'copyImageTemplateLocale');
  }

  getFileAdminFolders(): Observable<Folder[]> {
    return this.apiService.mainApiPost<RawFolder[]>(['appUser'], 'FileAdmin', 'getFolders').pipe(
      map(reduceFolders)
    );
  }

  getFileAdminFiles(folderId: Folder['id']): Observable<FileEntity[]> {
    return this.apiService.mainApiPost<RawFileEntity[] | ['ZERO']>([folderId, 'appUser'], 'FileAdmin', 'getFilesInFolder').pipe(
      map(list => list[0] === 'ZERO' ? [] : (list as RawFileEntity[]).map(reduceFile))
    );
  }

  createFileAdminFolder(name: string, parentFolderId: Folder['id']): Observable<RawFolder> {
    return this.apiService.mainApiPost([name, parentFolderId, 'appUser'], 'FileAdmin', 'insertChildFolder');
  }

  renameFileAdminFolder(name: string, folderId: Folder['id']) {
    return this.apiService.mainApiPost([folderId, name, 'appUser'], 'FileAdmin', 'renamefolder');
  }

  deleteFileAdminFolder(folderId: Folder['id']) {
    return this.apiService.mainApiPost([folderId, 'appUser'], 'FileAdmin', 'deletefolder');
  }

  uploadFileAdmin(folderId: Folder['id'], file: File, db: string) {
    const formData = new FormData();
    const date = new Date();

    formData.append('dbName', db);
    formData.append('timeStamp', `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`);
    formData.append('file', file);
    formData.append('fo_id', String(folderId));
    formData.append('fi_name', file.name);

    return this.apiService.uploadApiPost(formData, FileUploadType.File);
  }

  deleteFileAdmin(fileId: FileEntity['id']) {
    return this.apiService.mainApiPost([fileId, 'appUser'], 'FileAdmin', 'deleteOneFile');
  }

  getFileAdminAttachments(fileId: FileEntity['id']) {
    return this.apiService.mainApiPost<{ erArr: string[]; lArr: string[]; spArr: string[]; }>([fileId, 'appUser'], 'EMailTemplateAdmin', 'getEMailTemplateLocaleAttachment').pipe(
      map(resp => ({
        templateIds: resp.erArr ? resp.erArr.map(v => +v) : [],
        localeIds: resp.lArr ? resp.lArr.map(v => +v) : [],
        periodIds: resp.spArr ? resp.spArr.map(v => +v) : []
      }))
    );
  }

  setFileAdminAttachments(fileId: FileEntity['id'], ids: { templateIds: CopyToId[], localeIds: CopyToId[], periodIds: CopyToId[] }) {
    return this.apiService.mainApiPost([{
      fi_id: fileId,
      seasonPeriodArray: ids.periodIds,
      localeArray: ids.localeIds,
      emailReasonArray: ids.templateIds
    }, 'appUser'], 'EMailTemplateAdmin', 'setEmailTemplateLocaleAttachment');
  }

  getGuestRegistrationList({ name, hotel, fromDate, untilDate, status }: GuestRegistrationSearchData): Observable<GuestRegistrationItem[]> {
    return this.apiService.mainApiPost<RawGuestRegistrationItem[]>([prepareBookingListBody(name, hotel, fromDate, untilDate, status), 'appUser'], 'registrationForm', 'getBookingList').pipe(
      map(list => list.map(reduceGuestRegistrationItem))
    );
  }

  getBookingInfo(bookingId: number): Observable<{ fromDate: Date, untilDate: Date }> {
    return this.apiService.mainApiPost<{ fromDate: string; untilDate: string; }>([bookingId, 'appUser'], 'registrationForm', 'getBookingInfo').pipe(
      map(resp => ({ fromDate: parseDate(resp.fromDate, false), untilDate: parseDate(resp.untilDate, false) }))
    );
  }

  getLinkedGuestsCount(bookingId: number): Observable<number> {
    return this.apiService.mainApiPost<[string]>([bookingId, 'appUser'], 'registrationForm', 'getCountOfLinkedGuests').pipe(
      map(resp => +resp[0])
    );
  }

  isBookingFromChannelManager(bookingId: number): Observable<boolean> {
    return this.apiService.mainApiPost<['channelmanager' | string]>([bookingId, 'appUser'], 'registrationForm', 'checkIfChannelManagerBooking').pipe(
      map(resp => resp[0] === 'channelmanager')
    );
  }

  getRegistrationForm(registrationFormId: GuestRegistrationForm['id']): Observable<RegistrationFormGuests> {
    return this.apiService.mainApiPost<{
      regform: RawGuestRegistrationForm;
      bookingGuests?: RawGuestDetail[];
      guestGroup?: RawGroupGuest[];
      tourLeader?: RawGuestDetail;
    }>([registrationFormId, 'appUser'], 'registrationForm', 'getRegForm').pipe(
      map(resp => ({
        form: reduceRegistrationForm(resp.regform),
        individual: resp.bookingGuests ? resp.bookingGuests.map(reduceGuestDetail) : [],
        group: {
          leader: resp.tourLeader ? reduceGuestDetail(resp.tourLeader) : null,
          guests: resp.guestGroup ? resp.guestGroup.map(reduceGroupGuest) : []
        }
      }))
    );
  }

  addGuestToBooking(bookingId: number, isAdult = true) {
    return this.apiService.mainApiPost([bookingId, isAdult ? 'adult' : 'child', 'appUser'], 'registrationForm', 'addPersonToBookingGuest');
  }

  deleteManuallyAddedPerson(guestId: GuestDetail['id']) {
    return this.apiService.mainApiPost([guestId, 'appUser'], 'registrationForm', 'deleteManuallyAddedPerson');
  }

  saveRegistrationForm(body: RegFormBody, guests?: GuestDetail[], groupGuests?: GroupGuest[], leader?: GuestDetail | null) {
    let params;
    if ( body.registrationTypeId === 2 && groupGuests && leader) {
      params = {
        ...prepareRegFormBody(body),
        tourLeader_cbrf_id: leader.guestId.toString(),
        tourLeader_cbrf_guestCardNumber: leader.cardNumber ? leader.cardNumber.toString() : '',
        tourLeader_cbrf_registrationTaxType_id: leader.taxTypeId ? String(leader.taxTypeId) : null,
        guestGroupCountries: groupGuests.map(prepareGroupGuestBody)
      };
    } else if (guests) {
      params = {
        ...prepareRegFormBody(body),
        selectedGuests: guests.map(prepareIndividualGuestBody)
      };
    }
    return this.apiService.mainApiStatusPost<{ retId: number; }>([params, 'appUser'], 'registrationForm', 'saveRegistrationForm');
  }

  validateGuests(hotelRecordId: HotelRegistrationRecord['id'], all: GuestDetail[], mainGuest?: GuestDetail): Observable<GuestDetail | null> {
    return this.apiService.mainApiPost<[] | [string]>([
      `(${all.map(g => g.guestId).join(', ')})`,
      'appUser',
      mainGuest ? mainGuest.guestId : null,
      hotelRecordId
    ], 'registrationForm', 'validateGuests').pipe(
      map(resp => resp.length === 0 ? null : all.find(g => g.guestId === +resp[0]) as GuestDetail)
    );
  }

  forceSetDeparture(registrationFormId: RegFormBody['id'] | null) {
    return this.apiService.mainApiPost([registrationFormId,  'appUser'], 'registrationForm', 'forceSetDeparture');
  }

  getRegistrationForms({ name, hotel, fromDate, untilDate, from, until, type }: GuestRegistrationSearchData, mode: ViewMode): Observable<GuestRegistrationFormDetail[]> {
    return this.apiService.mainApiPost<RawGuestRegistrationFormDetail[]>([prepareRegistrationFormsBody(name, hotel, fromDate, untilDate, mode, from, until, type), 'appUser'], 'registrationForm', 'getRegformList').pipe(
      map(list => list.map(reduceRegistrationFormDetail))
    );
  }

  getPrintLink(hotel: HotelRegistrationRecord, forms: BasicGuestRegistrationForm | BasicGuestRegistrationForm[], mode: ViewMode): Observable<{ url: string, postParams?: { [name: string]: string } }> {
    type Response = { url: string, sessionid: null | string, postParams?: { value: string; name: string; }[] };
    const reduceResponse = resp => ({ ... resp, postParams: resp.postParams && resp.postParams.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {})});

    if (!Array.isArray(forms)) {
      if (
        [Providers.FERATEL, Providers.FERATELCH].includes(
          +hotel.raw.rfgs_guestRegistrationProvider_id
        ) &&
        +forms.number > 0 &&
        hotel.raw.cf_desklineEdition !== '3'
      ) {
        return of({
          url: `https://meldeclient.feratel.at/${
            +hotel.raw.rfgs_guestRegistrationProvider_id === Providers.FERATELCH
              ? 'meldeclientch'
              : 'meldeclient'
          }/${
            forms.number === '-1'
              ? 'MCLShowServlet/printMCLMeldeschein'
              : 'MCLInterfaceServlet/print'
          }`,
          postParams: {
            ...(forms.number === '-1'
              ? { guid: forms.numberInternal as string }
              : {}),
            mblattnr: forms.number,
            mcnummer: hotel.raw.rfgs_mcNumber,
            username: hotel.raw.rfgs_username,
            password: hotel.raw.rfgs_password,
          },
        });
      } else {
        return this.apiService
          .mainApiPost<Response>(
            [
              {
                rfgs_id: hotel.id,
                rg_number: forms.number,
                rg_numberInternal: forms.numberInternal,
                rg_id: forms.id,
              },
              'appUser',
            ],
            'registrationForm',
            'getPrintLink'
          )
          .pipe(
            tap((resp) =>
              this.printLinkLogout(hotel, resp.sessionid).toPromise()
            ),
            map(reduceResponse)
          );
      }
    }
    return this.apiService.mainApiPost<Response>([{
      rfgs_id: hotel.id,
      prepareregforms: mode === ViewMode.IN_PREPARATION,
      rg_number: forms.map(f => f.number).join(','),
      batchprint: true,
      rg_id: forms.map(f => f.id).join(','),
    }, 'appUser'], 'registrationForm', 'getPrintLink').pipe(tap(resp => this.printLinkLogout(hotel, resp.sessionid).toPromise()), map(reduceResponse));

  }

  markDeparted(forms: BasicGuestRegistrationForm[]) {
    return this.apiService.mainApiPost([forms.map(item => item.id).join(','),  'appUser'], 'registrationForm', 'markDeparted');
  }

  printLinkLogout(hotel: HotelRegistrationRecord, sessionId: string | null) {
    if ([Providers.AVS, Providers.WILKEN].includes(+hotel.raw.rfgs_guestRegistrationProvider_id)) {
      return of(null);
    }
    const previous = this.printLinkSession;
    this.printLinkSession = sessionId;

    // https://trello.com/c/pRO3eGct/200-customer-admin-guest-registration-clickable-icons-in-preparation-arrived-and-departed-tab-part-1-2
    if (previous) {
      return this.apiService.mainApiPost([{ sessionid: previous, rfgs_id: hotel.id },  'appUser'], 'registrationForm', 'printLinkLogout');
    }

    return of(null);
  }

  validateGuestsForRgId(form: BasicGuestRegistrationForm): Observable<{ valid: true } | { valid: false, bookingId: number, guestId: number }> {
    type Response = { status: 'OK'; rg_id: string; } | { status: 'ERROR', cbrf_id: string; booking_id: string; };

    return this.apiService.mainApiPost<Response>([form.id,  'appUser'], 'registrationForm', 'validateGuestsForRgId').pipe(
      map(resp => resp.status === 'ERROR' ? { valid: false, bookingId: +resp.booking_id, guestId: +resp.cbrf_id } : { valid: true })
    );
  }

  setArrival(form: BasicGuestRegistrationForm) {
    return this.apiService.mainApiStatusPost([form.id, 'appUser'], 'registrationForm', 'setArrival');
  }

  setDeparture(form: BasicGuestRegistrationForm) {
    return this.apiService.mainApiStatusPost([form.id, 'appUser'], 'registrationForm', 'setDeparture');
  }

  cancelRegform(form: BasicGuestRegistrationForm) {
    return this.apiService.mainApiStatusPost([form.id, 'appUser'], 'registrationForm', 'cancelRegform');
  }

  deleteRegform(form: BasicGuestRegistrationForm) {
    return this.apiService.mainApiStatusPost([form.id, 'appUser'], 'registrationForm', 'deleteRegform');
  }

  getSpecialOffers(includeOffline: boolean): Observable<SpecialOffer[]> {
    return this.apiService.mainApiPost<RawSpecialOffer[]>([includeOffline ? 'on' : 'off', 'appUser'], 'SpecialOffer', 'getSpecialOffers').pipe(
      map(resp => resp.map(reduceSpecialOffer))
    );
  }

  getSpecialOfferCategories(): Observable<FormOption<number>[]> {
    return this.apiService.mainApiPost<{ soc_id: string; socl_name: string }[]>([null, 'appUser'], 'AppClass', 'getSpecialOfferCategories').pipe(
      map(resp => resp.map(item => ({ value: +item.soc_id, name: item.socl_name })))
    );
  }

  getSpecialOfferDetails(id: SpecialOffer['id'], localeId: number): Observable<SpecialOfferDetails> {
    return this.apiService.mainApiPost<RawSpecialOfferDetails>([id, localeId, 'appUser'], 'SpecialOffer', 'getSpecialOfferDetail').pipe(
      map(reduceSpecialOfferDetails)
    );
  }


  insertSpecialOffer(name: string, localeId: number) {
    return this.apiService.mainApiPost<[string]>([{
      sol_title: name,
      sol_locale_id: localeId
    }, 'appUser'], 'SpecialOffer', 'insertSpecialOffer').pipe(
      map(resp => +resp[0])
    );
  }

  copySpecialOffer(offer: SpecialOffer) {
    return this.apiService.mainApiPost<[string]>([offer.id, 'appUser'], 'SpecialOffer', 'copySO').pipe(
      map(resp => +resp[0])
    );
  }

  deleteSpecialOffer(offer: SpecialOffer) {
    return this.apiService.mainApiPost([offer.id, 'appUser'], 'SpecialOffer', 'deleteSO');
  }

  uploadSpecialOfferImage(id: SpecialOffer['id'], file: File, db: string) {
    const formData = new FormData();
    const date = new Date();

    formData.append('dbName', db);
    formData.append('so_id', String(id));
    formData.append('imageType', 'so_img001');
    formData.append('timeStamp', `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`);
    formData.append('Filedata', file);

    return this.apiService.uploadApiPost(formData, FileUploadType.Image);
  }

  deleteSpecialOfferImage(offer: SpecialOffer) {
    return this.apiService.mainApiPost([offer.id, 'so_img001', 'appUser'], 'SpecialOffer', 'clearImage');
  }

  editSpecialOfferDetails(offer: SpecialOfferDetails, localeId: number) {
    return this.apiService.mainApiPost([prepareSpecialOfferBody(offer, localeId), 'appUser'], 'SpecialOffer', 'editSpecialOfferDetail');
  }

  getSpecialOfferPricingDetail(offer: SpecialOffer): Observable<SpecialOfferPricing> {
    return this.apiService.mainApiPost<RawSpecialOfferPricing>([offer.id, 'appUser'], 'SpecialOffer', 'getSpecialOfferPricingDetail').pipe(
      map(reduceSpecialOfferPricing)
    );
  }

  setIndividualCatering(offer: SpecialOffer, enabled: boolean) {
    return this.apiService.mainApiPost([{so_individualCatering: enabled ? 'on' : 'off', so_id: offer.id }, 'appUser'], 'SpecialOffer', 'setIndividualCatering');
  }

  saveSpecialOfferPricing(offer: SpecialOffer, pricing: SpecialOfferPricing, saveForAll: boolean) {
    return this.apiService.mainApiPost([{ ...prepareSpecialOfferPricingBody(offer, pricing), saveForAll: saveForAll ? 'on' : 'off' }, 'appUser'], 'SpecialOffer', 'adminSpecialOfferPricingDetail');
  }

  getSpecialOfferPeriods(offer: SpecialOffer): Observable<SpecialOfferPeriod[]> {
    return this.apiService.mainApiPost<RawSpecialOfferPeriod[]>([offer.id, 'appUser'], 'SpecialOffer', 'getSpecialOfferPeriod').pipe(
      map(resp => resp.map(reduceSpecialOfferPeriod))
    );
  }

  getSpecialOfferPeriodPricingDetails(period: SpecialOfferPeriod): Observable<SpecialOfferPeriodPricing> {
    return this.apiService.mainApiPost([period.id, 'appUser'], 'SpecialOffer', 'getSpecialOfferPeriodPricingDetailForSOP').pipe(
      map(reduceSpecialOfferPeriodPricing)
    );
  }

  saveSpecialOfferPeriodPricing(period: SpecialOfferPeriod, pricing: SpecialOfferPeriodPricing) {
    return this.apiService.mainApiPost([{
      sop_id: period.id,
      entityGroup: prepareSpecialOfferPricingItems(pricing.ageGroups, pricing.prices)
    }, 'appUser'], 'SpecialOffer', 'adminSpecialOfferPeriodPricingDetail');
  }

  resetSpecialOfferPeriodPricing(period: SpecialOfferPeriod) {
    return this.apiService.mainApiPost([period.id, 'appUser'], 'SpecialOffer', 'adminSpecialOfferPeriodPricingDetailReset');
  }

  getPortalFeatures(localeId: number): Observable<PortalFeature[]> {
    return this.apiService.mainApiPost<RawPortalFeature[]>([localeId, 'appUser'], 'Portal', 'getPortalFeatures').pipe(
      map(resp => resp.map(reducePortalFeature))
    );
  }

  getPortalCategories(localeId: number): Observable<PortalCategory[]> {
    return this.apiService.mainApiPost<RawPortalCategory[]>([localeId, 'appUser'], 'Portal', 'getPortalCategories').pipe(
      map(resp => resp.map(reducePortalCategory))
    );
  }

  getPortal(localeId: number): Observable<Portal> {
    return this.apiService.mainApiPost<RawPortal>([localeId, 'appUser'], 'Portal', 'getCompanyPortal').pipe(
      map(reducePortal)
    );
  }

  uploadPortalImage(data: PortalImage, file: File, db: string) {
    const formData = new FormData();
    const date = new Date();

    formData.append('dbName', db);
    formData.append('imageType', data.key);
    formData.append('timeStamp', `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`);
    formData.append('Filedata', file);

    return this.apiService.uploadApiPost(formData, FileUploadType.Image);
  }

  deletePortalImage(data: PortalImage) {
    return this.apiService.mainApiPost([data.key, 'appUser'], 'Portal', 'clearImage');
  }

  savePortal(data: Portal, features: PortalFeature[], categories: PortalCategory[]) {
    return this.apiService.mainApiPost([preparePortalBody(data, features, categories), 'appUser'], 'Portal', 'setCompanyPortal');
  }

  getCmsActive() {
    return this.apiService.mainApiPost<['on' | 'flashCMS' | 'htmlCMS' | 't3006']>(['appUser'], 'cms', 'getCmsActive').pipe(
      map(resp => resp[0])
    );
  }

  getCmsText(localeId: number): Observable<WebsitePages> {
    return this.apiService.mainApiPost<RawWebsitePages>([localeId, 'appUser'], 'cms', 'getCmsText').pipe(
      map(reduceWebsitePages)
    );
  }

  saveCmsText(source: WebsitePageSource, page: WebsitePage, localeId: number) {
    return this.apiService.mainApiPost<RawWebsitePages>([{
      what: source,
      heading: page.heading,
      locale_id: localeId,
      text: page.text
    }, 'appUser'], 'cms', 'setCmsText');
  }

  ////

  getCustomers(substring: string = ''): Observable<CustomerItem[]> {
    return this.apiService.mainApiPost<RawCustomerItem[]>([substring, 0], 'CustomerAdmin', 'getCustomers').pipe(
      map(resp => resp.map(reduceCustomerItem))
    );
  }

  getCustomerDetails(id: CustomerItem['id']) {
    return this.apiService.mainApiPost([id], 'CustomerDetail', 'getCustomerDetail').pipe(
      map(reduceCustomerItemDetails)
    );
  }

  clearCache(db: string) {
    return this.apiService.mainApiPost([db], 'CustomerDetail', 'clearCache');
  }

  getCustomerUsers(db: string): Observable<CustomerUser[]> {
    return this.apiService.mainApiPost<RawCustomerUser[]>([db], 'CustomerUsers', 'getCustomerUsers').pipe(
      map(list => list.map(reduceCustomerUser))
    );
  }

  deleteCustomerUser(db: string, id: CustomerUser['id']) {
    return this.apiService.mainApiPost([{ aug_dbName: db, aug_id: id }, db], 'CustomerUsers', 'deleteCustomerUser');
  }

  updateCustomerUser(db: string, customer: CustomerUser) {
    return this.apiService.mainApiPost<[number | 'USEREXISTS']>([{
      aug_id: customer.id,
      aug_userName: customer.username,
      aug_active: customer.active ? 'on' : 'off',
      aug_dbName: db
    }, db], 'CustomerUsers', 'updateCustomerUser').pipe(
      map(resp => {
        if (resp[0] === 'USEREXISTS') {
          throw new Error('already_exist');
        }
        return resp[0];
      })
    );
  }

  resetCustomerUserPassword(db: string, username: CustomerUser['username']): Observable<boolean> {
    return this.apiService.mainApiPost<['OK'?]>([username, db], 'CustomerUsers', 'resetPassword').pipe(
      map(resp => resp[0] === 'OK')
    );
  }

  insertCustomerUser(db: string, username: CustomerUser['username']): Observable<number> {
    return this.apiService.mainApiPost<[number | 'USEREXISTS']>([{ aug_userName: username, aug_dbName: db }], 'CustomerUsers', 'insertCustomerUser').pipe(
      map(resp => {
        if (resp[0] === 'USEREXISTS') { throw new Error('already_exist'); }
        return resp[0];
      })
    );
  }

  getLoginMessage(customerId: number): Observable<LoginMessage> {
    return this.apiService.mainApiPost<RawLoginMessage>([customerId, 'srv001', 'appUser'], 'LoginMessage', 'getLoginMessage').pipe(
      map(reduceLoginMessage)
    );
  }

  setLoginMessage(customerId: number, message: LoginMessage) {
    return this.apiService.mainApiPost([prepareLoginMessageBody(customerId, message)], 'LoginMessage', 'setLoginMessage');
  }

  getBillableCustomers(): Observable<BillableCustomer[]> {
    return this.apiService.mainApiPost<RawBillableCustomer[]>([], 'CustomerReporting', 'getBillableCustomers').pipe(
      map(resp => resp.map(reduceBillableCustomer))
    );
  }

  getAdminPortals(): Observable<PortalAdmin[]> {
    return this.apiService.mainApiPost<RawPortalAdmin[]>([], 'PortalAdmin', 'getPortals').pipe(
      map(resp => resp.map(reducePortalAdmin))
    );
  }

  getAdminPortal(id: PortalAdmin['id']): Observable<PortalAdmin> {
    return this.apiService.mainApiPost<RawPortalAdmin>([id], 'PortalAdmin', 'getPortalDetail').pipe(
      map(reducePortalAdmin)
    );
  }

  checkAdminPortalSerialNo() {
    return this.apiService.mainApiPost<[string]>([1], 'PortalAdmin', 'checkSerialNo').pipe(
      map(resp => resp[0])
    );
  }

  saveAdminPortal(portal: PortalAdmin) {
    return this.apiService.mainApiPost([prepareAdminPortalBody(portal)], 'PortalAdmin', 'adminPortal');
  }

  getAdminPortalCustomers(id: PortalAdmin['id']): Observable<PortalAdminCustomer[]> {
    return this.apiService.mainApiPost<RawPortalAdminCustomer[]>([id], 'PortalAdmin', 'getCustomersForPortal').pipe(
      map(resp => resp.map(reducePortalAdminCustomer))
    );
  }

  deleteAdminPortalCustomer(id: PortalAdminCustomer['id']) {
    return this.apiService.mainApiPost([id], 'PortalAdmin', 'deletePortalCustomer');
  }

  searchAdminPortalCustomers(text: string, portalId: PortalAdmin['id']): Observable<PortalAdminCustomerSearched[]> {
    return this.apiService.mainApiPost<{
      c_id: string;
      c_name: string;
      c_dbName: string;
    }[]>([text, portalId], 'PortalAdmin', 'searchCustomers').pipe(
      map(resp => resp.map(reducePortalAdminCustomer))
    );
  }

  addPortalCustomer(id: PortalAdminCustomer['id'], portalId: PortalAdmin['id']) {
    return this.apiService.mainApiPost([id, portalId], 'PortalAdmin', 'addPortalCustomer');
  }

  savePortalCustomerDetail(customer: PortalAdminCustomer) {
    return this.apiService.mainApiPost([{
      pc_id: customer.id,
      pc_remoteId: customer.remoteId,
      pc_active: customer.active ? 'on' : 'off',
      pc_comment: customer.comment
    }], 'PortalAdmin', 'savePortalCustomerDetail');
  }

  createAdminPortal(portal: PortalAdminBody) {
    return this.apiService.mainApiPost<[number]>([prepareAdminPortalBody(portal)], 'PortalAdmin', 'newPortal').pipe(
      map(resp => resp[0])
    );
  }

  getSpecialOfferCategoriesObjects(): Observable<FormOption<number>[]> {
    return this.apiService.mainApiPost<{ socl_name: string; soc_id: string; }[]>([], 'PortalAdmin', 'getSpecialOfferCategoriesObjects').pipe(
      map(resp => resp.map(item => ({ value: +item.soc_id, name: item.socl_name })))
    );
  }

  getPortalSpecialOfferCategories(portalId: PortalAdmin['id']): Observable<PortalAdminCategoryPackage[]> {
    return this.apiService.mainApiPost<RawPortalAdminCategoryPackage[]>([portalId], 'PortalAdmin', 'getPortalSpecialOfferCategories').pipe(
      map(resp => resp.map(reducePortalAdminCategory))
    );
  }

  savePortalSpecialOfferCategory(categories: PortalAdminCategoryPackage[]) {
    return this.apiService.mainApiPost([categories.map(item => ({
      psoc_portal_id: item.portalId,
      psoc_specialOfferCategory_id: item.specialOfferCategoryId,
      psoc_active: item.active ? 'on' : 'off'
    }))], 'PortalAdmin', 'adminPortalSpecialOfferCategory');
  }

  uploadPortalAdminCategoryImage(categoryId: PortalAdminCategoryPackage['specialOfferCategoryId'], portalId: PortalAdmin['id'], file: File, db: string) {
    const formData = new FormData();
    const date = new Date();

    formData.append('dbName', db);
    formData.append('psoc_portal_id', String(portalId));
    formData.append('psoc_specialOfferCategory_id', String(categoryId));
    formData.append('imageType', 'psoc_image');
    formData.append('timeStamp', `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`);
    formData.append('Filedata', file);

    return this.apiService.uploadApiPost(formData, FileUploadType.Image);
  }

  deletePortalAdminCategoryImage(categoryId: PortalAdminCategoryPackage['specialOfferCategoryId'], portalId: PortalAdmin['id']) {
    return this.apiService.mainApiPost([portalId, categoryId], 'PortalAdmin', 'deletePortalSpecialOfferCategoryImage');
  }

  deletePortal(portalId: PortalAdmin['id']) {
    return this.apiService.mainApiPost([portalId], 'PortalAdmin', 'deletePortal');
  }

  getPortalAdminCategories(): Observable<PortalAdminCategory[]> {
    return this.apiService.mainApiPost<{ soc_id: string; soc_ident: string }[]>([], 'PortalAdmin', 'getSpecialOfferCategories').pipe(
      map(resp => resp.map(item => ({ id: +item.soc_id, identifier: item.soc_ident })))
    );
  }

  deletePortalCategory(id: PortalAdminCategory['id']) {
    return this.apiService.mainApiPost([id], 'PortalAdmin', 'deletePortalCategory');
  }

  getPortalCategoryTranslations(id: PortalAdminCategory['id']): Observable<PortalAdminCategoryTranslation[]> {
    return this.apiService.mainApiPost<RawPortalAdminCategoryTranslation[]>([id], 'PortalAdmin', 'getSOCTranslation').pipe(
      map(resp => resp.map(item => ({ localeId: item.socl_locale_id, name: item.socl_name })))
    );
  }

  savePortalCategory(id: PortalAdminCategory['id'] | null, ident: string, translations: PortalAdminCategoryTranslation[]) {
    return this.apiService.mainApiPost([{
      soc_id: id || 0,
      adminMode: id === null ? 'I' : 'U',
      soc_ident: ident,
      socls: translations.map(t => ({
        socl_locale_id: t.localeId,
        socl_name: t.name
      }))
    }], 'PortalAdmin', 'adminSOCLocale');
  }

  validateAll() {
    return this.apiService.mainApiPost<ValidateAllResponse>(['appUser'], 'DBValidation', 'validateAll');
  }

  getRoomPriceErrors(): Observable<RoomPriceError[]> {
    return this.apiService.mainApiPost<{ egl_value: string; sp_name: string; }[]>(['appUser'], 'DBValidation', 'getRoomPriceErrors').pipe(
      map(resp => resp.map(item => ({ number: item.egl_value, name: item.sp_name })))
    );
  }

  public createMultiUser(username: string, password: string, databases: string): Observable<MultiUserCreateResponse> {
    return this.apiService.mainApiPost<MultiUserCreateResponse>(
      [
        {
          username,
          password,
          dbs: databases,
        }
      ],
      'CustomerAdmin',
      'createMultiUser'
    );
  }
}
