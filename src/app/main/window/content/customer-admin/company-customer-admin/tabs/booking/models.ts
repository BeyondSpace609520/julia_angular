import { Trigger } from '@/app/main/models';

export interface RawBookingDetail {
    b_actionCode: null | string;
    b_allottee_id: null | string;
    b_boDate: null | string;
    b_bookingCode: null | string;
    b_bookingNo: string;
    b_bookingStatus_id: string;
    b_booking_id: null | string;
    b_browserSession: string;
    b_cancellationCM: Trigger;
    b_cancellationDate: null | string;
    b_cancellationDueDate: null | string;
    b_cancellationFee: null | string;
    b_checkedIn: Trigger;
    b_checkedOut: Trigger;
    b_cmChangeToBlockInfo: Trigger;
    b_collectType: null | string;
    b_comment: string;
    b_commentBookingNo: null | string;
    b_commentInternal: string;
    b_creationDate: string;
    b_creditCardValidatedBooking: Trigger;
    b_creditCard_id: null | string;
    b_customBookingSource_id: string;
    b_customer_id: string;
    b_emailText: string;
    b_footerText: string;
    b_fullGreeting: string;
    b_headerText: string;
    b_id: string;
    b_initialBookingStatus_id: string;
    b_ipAddress: string;
    b_locale_id: string;
    b_locked: Trigger;
    b_paymentMethod_id: null | string;
    b_permanentlyDeleted: Trigger;
    b_personalMessage: string;
    b_prepaymentAmount: string;
    b_prepaymentAmountPaid: string;
    b_prepaymentDate: string;
    b_prepaymentDueDate: string;
    b_prepaymentDueDays: string;
    b_prepaymentReminderSentDate: string;
    b_resDate: string;
    b_saraDeepLink: null | string;
    b_selfAdminDate: null | string;
    b_selfAdminPinCode: string;
    b_sendOfferReminder: Trigger;
    b_source: string;
    b_sourcePlatform: string;
    b_sourcePlatformProfileId: null | string;
    b_statusExpiryDate: null | string;
    b_switchedToEnquiry: string;
    b_validUntil: null | string;
    bs_color: string;
    bs_id: string;
    bs_name: string;
    cancelled: Trigger;
    checkDate: string;
    l_active: Trigger;
    l_desc: string;
    l_icon: string;
    l_id: string;
    l_name: string;
    l_nameDisplay: string;
    pml_name?: string;
    paymentMethod?: string;
    creditCardDetail?: {
        cc_addressLine1: string;
        cc_city: string;
        cc_country: string;
        cc_county: string;
        cc_creationDate: string;
        cc_creditCardType_id: string;
        cc_customer_id: string;
        cc_expiryDateMonth: string;
        cc_expiryDateYear: string;
        cc_holderName: string;
        cc_id: string;
        cc_numDataRequested: string;
        cc_number: string;
        cc_phoneNo: string;
        cc_postCode: string;
        cc_token: null | string;
        cc_verificationCode: string;
        cct_name: string;
        pciExpired: Trigger;
    };
}

export interface BookingDetail {
    id: number;
    name: string;
    status: string;
    creationDate: Date | null;
    bookingNo: string;
    pinCode: string;
    cancelled: boolean;
    source: string;
    sourcePlatform: string;
    paymentMethod?: string;
    ip: string;
    comment: string;
    commentInternal: string;
    paymentType?: string;
    depositAmount: number;
    creditCard?: {
        token: string | null;
        type: string;
        holder: string;
        number: string;
        verificationCode: string;
        expiryAt: string;
        pciExpired: boolean;
    };
}

export interface RawGuestRelatedDetail {
    agreedAt: string;
    legalDocs: {
        agreed: boolean;
        code: string;
        docUrl: string;
        id: string;
        name: string;
        version: string;
    }[];
}

export interface GuestRelatedDetail {
    agreedAt: Date;
    docs: {
        id: number;
        name: string;
        version: string;
        agreed: boolean;
        code: string;
        url: string;
    }[];
}

export interface RawBookingRoom {
    e_active: Trigger;
    e_adminOnly: Trigger;
    e_creationDate: string;
    e_entityGroup_id: string;
    e_entityType_id: string;
    e_entity_id: string;
    e_icalSyncDate: string | null;
    e_id: string;
    e_level: string;
    e_name: string;
    e_sortOrder: string;
    e_thumbSketchPic: string | null;
    e_uniqueNo: string;
    eb_arrivalTime: string | null;
    eb_billVersionDetail_id: string;
    eb_booking_id: string;
    eb_calculationSet: string;
    eb_calculationTime: string;
    eb_childrenAges: string;
    eb_comment: string;
    eb_creationDate: string;
    eb_entity_id: string;
    eb_fromDate: string;
    eb_fromDateOrig: string | null;
    eb_id: string;
    eb_isWishRoom: Trigger;
    eb_manualPriceCalculation: string | null;
    eb_nightsStay: string;
    eb_noOfChildren: string;
    eb_noOfCots: string;
    eb_noOfGarages: string;
    eb_noOfPersons: string;
    eb_noOfPetsLarge: string;
    eb_noOfPetsSmall: string;
    eb_serviceChargeCalculated: string | null;
    eb_serviceChargeIncluded: Trigger;
    eb_serviceTypeCharge: string | null;
    eb_serviceType_id: string;
    eb_shoppingCartVersion: string;
    eb_source: string;
    eb_specialOfferPeriod_id: string | null;
    eb_totalChargingSchemeCharge: string;
    eb_totalCleanUpCharge: string;
    eb_totalCotCharge: string;
    eb_totalDiscount: string;
    eb_totalEntityPriceAdults: string;
    eb_totalEntityPriceChildren: string;
    eb_totalGarageCharge: string;
    eb_totalNet: string;
    eb_totalNetOrig: string | null;
    eb_totalPetCharge: string;
    eb_totalServiceCharge: string;
    eb_totalShortStayCharge: string;
    eb_totalVisitorsTax: string;
    eb_totalWishRoomCharge: string;
    eb_untilDate: string;
    eb_untilDateOrig: string | null;
}

export interface BookingRoom {
    uniqueNo: string;
    fromDate: Date;
    untilDate: Date;
    nightsStay: number;
    noOfPersons: number;
    noOfChildren: number;
    noOfPetsSmall: number;
    noOfPetsLarge: number;
    childrenAges: string;
    totalPriceAdults: number;
    totalPriceChildren: number;
    totalServiceCharge: number;
    totalVisitorsTax: number;
    totalPetCharge: number;
    totalCleanUpCharge: number;
    totalDiscount: number;
    totalShortStayCharge: number;
    totalNet: number;
}
