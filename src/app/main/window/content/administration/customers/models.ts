import { Trigger } from '@/app/main/models';

export interface RawCustomerItem {
    c_id: string;
    c_name: string;
    c_dbName: string;
    cs_name: CustomerItemStatus;
    c_nextBillDate: null | string;
}

export type CustomerItemStatus = 'Online' | 'Demo' | 'Gekündigt'
    |'Test' | 'Bestellung' | 'Datenerfassung' | 'Einrichtung'
    | 'Einschulung' | 'ReadyForOnline' | 'Blank';

export interface CustomerItem {
    id: number;
    name: string;
    dbName: string;
    status: CustomerItemStatus;
    nextBillDate: null | Date;
}

export interface RawCustomerItemDetails {
    c_id: string;
    c_creationDate: string;
    c_reseller_id: string;
    c_dbName: string;
    c_serialNumber: string;
    c_customerStatus_id: string;
    c_implementationStatus_id: null | string;
    c_accountNo: string;
    c_name: string;
    c_addressLine1: string;
    c_addressLine2: null | string;
    c_addressLine3: null | string;
    c_postCode: string;
    c_city: string;
    c_county: string;
    c_country: string;
    c_phoneNo: string;
    c_faxNo: string;
    c_eMail: string;
    c_webUrl: string;
    c_salutation_id: string;
    c_title_id: string;
    c_contactFirstName: string;
    c_contactLastName: string;
    c_contactPhoneNo: string;
    c_contactMobileNo: string;
    c_contactEMail: string;
    c_noOfRooms: string;
    c_noOfBeds: string;
    c_taxNo: string;
    c_hotelApp: string;
    c_hotelSoftware_id: string;
    c_generalLocation: 'city' | 'holiday';
    c_openSeason: '01' | '02' | 'wholeYear';
    c_category: string;
    c_categoryStars: string;
    c_daysOpenPerYear: null | string;
    c_nextBillDate: null | string;
    c_quicksEnabled: Trigger;
    c_loginMessageActive: Trigger;
    c_loginMessageTitle: string;
    c_loginMessage: string;
    c_comment: null | string;
    c_implSalesPerson: string;
    c_implOrderReceivedDate: string;
    c_implNoOfBeds: string;
    c_implNoOfBedsOverX: string;
    c_implERActive: Trigger;
    c_implERProviderNumber: string;
    c_implFeratelRequested: Trigger;
    c_implFeratelActive: Trigger;
    c_implTiscoverRequested: Trigger;
    c_implTiscoverActive: Trigger;
    c_implSupportRequested: Trigger;
    c_implNewsLetterActivated: Trigger;
    c_implWelcomeMailSentDate: string;
    c_implFollowUpDate: null | string;
    c_implRoomlistReceived: Trigger;
    c_implDataRequestedDate: Trigger;
    c_implAllDataReceived: Trigger;
    c_implSMTPStatus: string;
    c_implCompletedDate: null | string;
    c_implPriceCheckLinkSentDate: string;
    c_implPriceCheckLinkFollowUpDate: null | string;
    c_implPricesConfirmedDate: string;
    c_implSchoolingPreInfoSent: string;
    c_implSchoolingDate: string;
    c_implSchoolingDataSent: Trigger;
    c_implWebDevDataSent: Trigger;
    c_implOORequested: Trigger;
    c_implOOActive: Trigger;
    c_implUURequested: Trigger;
    c_implUUActive: Trigger;
    c_implOnlineOnWebsite: Trigger;
    c_implPricelistReceived: Trigger;
    c_latitude: string;
    c_longitude: string;
    c_isDefault: Trigger;
    c_implOrderNo: null | string;
    c_channelManagement: Trigger;
    c_implMobilePageActive: Trigger;
    c_implMobileClientActive: Trigger;
    c_changeCMBookingsToBlocks: Trigger;
    c_salesForceId: null | string;
    c_sugarId: string;
    c_sugarContactId: string;
    c_sugarFulFillmentId: string;
    c_nullSugarId: string;
    c_meldewesen: Trigger;
    c_onlineCheckIn: Trigger;
    c_guestRegistrationProvider_id: string;
    c_sendReservationsToCM: Trigger;
    c_country_id: string;
    c_webWidget: Trigger;
    c_roomOwnerModule: Trigger;
    c_hasFeratelEnquiryPool: Trigger;
    c_title: null | string;
    c_hasWebsiteModule: string;
    c_hasAdvancedPricingModule: Trigger;
    c_hasReportingModule: Trigger;
    c_showIcalLinks: Trigger;
    c_serialNumberAdvanced: string;
    c_hasCashRegisterModule: Trigger;
    c_qcShareData: Trigger;
    c_qcRating: string;
    c_cashRegisterProvider: string;
    c_cashRegisterProviderActive: Trigger;
    c_lastModified: string;
    c_server_id: string;
    c_guestMapActive: Trigger;
    c_fTrustCbId: null | string;
    c_fTrustToken: null | string;
    c_nextSugarDataNagScreenConfirmationDate: string;
    c_newCateringVersion: Trigger;
    c_ccProxyIteration: string;
    c_useAngularRoomplan: Trigger;
    c_gdprAvAccepted: Trigger;
    c_gdprShowUpsellingModal: Trigger;
    c_aatHideModal: Trigger;
    c_aatAdminPortal: Trigger;
    c_aatContentStatus: null | string;
    c_aatLastApproved: null | string;
    c_roomplanRolloutMode: Trigger;
    c_hasFeratelEnquiryPoolForced: null | string;
    c_juliaAngular: Trigger;
    c_fullServiceCustomer: string;
    c_cashRegisterProviderInterfaceType: null | string;
    c_beRoomLevelPricingEnabled: Trigger;
    c_billingEnabled: Trigger;
    c_specialOfferEnabled: Trigger;
    c_poweredByEnabled: Trigger;
    noOfBeds: string;
    noOfRooms: string;
}


export interface CustomerItemDetails {
    id: number;
    accountNo: string;
    name: string;
    addressLine1: string;
    postCode: string;
    city: string;
    county: string;
    country: string;
    phoneNo: string;
    faxNo: string;
    email: string;
    webUrl: string;
    quicksEnabled: boolean;
    billingEnabled: boolean;
    specialOfferEnabled: boolean;
    poweredByEnabled: boolean;
    taxNo: string;
    hotelSoftwareId: number;
    noOfBeds: number;
    noOfRooms: number;
    daysOpenPerYear: string | null;
    generalLocation: 'city' | 'holiday';
    openSeason: '01' | '02' | 'wholeYear';
    category: ('private' | 'BnB' | 'hotel' | 'inn')[];
    categoryStars: number;
    salutationId: number;
    title: string | null;
    contactFirstName: string;
    contactLastName: string;
    contactPhoneNo: string;
    contactMobileNo: string;
    resellerId: number;
    customerStatusId: number;
    dbName: string;
    serialNumber: string;
    meldewesen: boolean;
    onlineCheckIn: boolean;
    beRoomLevelPricingEnabled: boolean;
    isDefault: boolean;
    creationDate: Date;
    contactEmail: string;
}

export interface RawCustomerUser {
    aug_id: string;
    aug_userName: string;
    aug_password: string;
    aug_dbName: string;
    aug_companyName: string;
    aug_lastLogin: string;
    aug_lastLoginIP: string;
    aug_active: Trigger;
    aug_reseller_id: string;
    aug_isAdmin: Trigger;
    aug_eMail: null | string;
    aug_lastLoginServer: string;
    aug_lastLoginApplication: string;
    aug_failedLoginAttemptCount: string;
    aug_defaultLoginServer: string;
    aug_firebaseId: string;
}

export interface CustomerUser {
    id: number;
    username: string;
    active: boolean;
    lastLogin: Date;
    lastIP: string;
}


export interface RawLoginMessage {
    c_loginMessageActive: Trigger;
    c_loginMessageTitle: string;
    c_loginMessage: string;
}

export interface LoginMessage {
    active: boolean;
    title: string;
    message: string;
}

export interface RawCentralSalutation {
  s_id: string;
  s_name: string;
  s_sortOrder: string;
}