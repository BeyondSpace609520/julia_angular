export interface Country {
  c_id: number;
  c_name: string;
  cl_name: string;
}

/**
 * Salutation list
 */
export interface Salutations {
  salutationLocale: SalutationLocale[];
  specialSalutations: Salutation[];
  standardSalutations: Salutation[];
}

/**
 * Salutation dropdown item
 */
export interface Salutation {
  displayField: string;
  s_id: number;
  s_justFor_locale_id: number;
  s_mapsToStandard_salutation_id: number;
  systemName: string;
}

export interface SalutationLocale {
  sl_locale_id: number;
  sl_preSalutation: string;
  sl_salutation: string;
  sl_salutation_id: number;
}

/**
 * Error message data
 */
export interface ErrorMessage {
  message: string;
  urgency: ErrorUrgency;
}

/**
 * Error urgency setting
 */
export enum ErrorUrgency {
  Insignificant,
  Minor, // Shows alert
  Warning, // Shows alert
  Error, // Shows modal
  Crucial, // Shows modal
}

export interface PriceFormat {
  value: string;
  prefix: string;
  postfix: string;
}

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export interface CompanySettings {
  cc_viewType?: string;
  c_name?: string;
  c_contactName?: string;
  c_addressLine1?: string;
  c_addressLine2?: string;
  c_addressLine3?: string;
  c_city?: string;
  c_postCode?: string;
  c_country?: string;
  c_tel?: string;
  c_fax?: string;
  c_webSite?: string;
  c_iframedWebsiteURL?: string;
  c_eMail?: string;
  c_logo?: string;
  c_pic01?: string;
  c_pic02?: string;
  c_beRoomLevelPricingEnabled?: string;
  c_feShowRoomDetail?: string;
  c_feShowRoomCalendar?: string;
  c_feShowRoomNumbers?: string;
  c_feShowRoomPrice?: string;
  c_feLocale_id?: number;
  c_feNoOfRoomsPerCategory?: number;
  c_feNewsletterEnabled?: string;
  c_feMaxNoOfRooms?: number;
  c_visitorsTaxEnabled?: string;
  c_visitorsTaxIncluded?: string;
  c_taxNo?: string;
  c_bankName?: string;
  c_accountHolder?: string;
  c_accountNumber?: string;
  c_bankNumber?: string;
  c_iban?: string;
  c_swift?: string;
  c_district?: string;
  c_tel2?: string;
  c_eBLink?: string;
  c_initWizardDate?: Date;
  c_loginDB?: string;
  c_gapFillEnabled?: string;
  c_lastMinutesEnabled?: string;
  c_cancellationEnabled?: string;
  c_termsConditionsEnabled?: string;
  c_prePaymentActive?: boolean;
  c_prePaymentDaysAfterBooking?: number;
  c_prePaymentUntilDaysBeforeBookingActive?: boolean;
  c_prePaymentUntilDaysBeforeBooking?: number;
  c_prePaymentPerc?: number;
  c_prePaymentHideBankTransfer?: boolean;
  c_useCustomSMTP?: string;
  c_smtpServer?: string;
  c_smtpUserName?: string;
  c_smtpPassword?: string;
  c_smtpFromName?: string;
  c_smtpFromEMail?: string;
  c_smtpReplyToName?: string;
  c_smtpReplyToEMail?: string;
  c_smtpPort?: number;
  c_smtpSsl?: boolean;
  c_smtpTls?: boolean;
  c_currency_id?: number;
  c_invisibleBookingHistory?: string;
  c_blockColor?: string;
  c_taxEnabled?: boolean;
  c_defaultTax_id?: number;
  c_billingEnabled?: boolean;
  c_specialOfferEnabled?: boolean;
  c_poweredByEnabled?: boolean;
  c_holidayCheckId?: string;
  c_holidayCheckEnabled?: boolean;
  c_specialOfferTabPosition?: string;
  c_invoiceCreatedIndicatorColor?: string;
  c_channelAllocationColor?: string;
  c_fbShareURL?: string;
  c_facebookUrl?: string;
  c_twitterUrl?: string;
  c_youtubeUrl?: string;
  c_googlePlusUrl?: string;
  c_beShowEnquiries?: boolean;
  c_beShowBlocks?: boolean;
  c_beShowNarrowLines?: string;
  c_epSettingFormDayTolerance?: number;
  c_epSettingManualAssignDayTolerance?: number;
  c_epSettingAutoAnswerComment?: boolean;
  c_epSettingAutoAnswerDeskline?: boolean;
  c_epSettingAutoAnswerEnquiryForm?: boolean;
  c_epSettingSplitToMultipleRooms?: boolean;
  c_displayVisitorsTax?: string;
  c_displayCleanupCharge?: string;
  c_displayPetCharge?: string;
  c_displayCotCharge?: string;
  c_displayCatering?: string;
  c_displayGarage?: string;
  c_displayEarlyBirdDiscount?: string;
  c_displayLongStayDiscount?: string;
  c_displayOtherCharges?: string;
  c_displayShortStayCharge?: string;
  c_displayCategoryForSpecialOffer?: string;
  c_displayLastMinuteDiscount?: string;
  c_timeGapTilArrival?: string;
  c_channelManagementActive?: string;
  c_showRoomsInFrontend?: string;
  c_showSpecialOffersInFrontend?: string;
  c_hideCatering?: string;
  c_defaultCountry_id?: string;
  c_specialOfferDayTolerance?: string;
  c_analyticsTrackingCode?: string;
  c_notifyAtXNoOfRooms?: string;
  c_useRoundingHack?: string;
  c_noSplittingOutForSpecialOffers?: string;
  c_showCheckin?: string;
  c_showCheckout?: string;
  c_sendEventsAtOffer?: string;
  c_sendEventsAtBooking?: string;
  c_sendEventsAtReservation?: string;
  c_sendEventsAtGoodJourney?: string;
  c_gapFillIgnoreArrival?: string;
  c_gapFillIgnoreDeparture?: string;
  c_onlyBookableOverSpecialOffersInFrontend?: string;
  c_hideSpecialOffersCompletelyInFrontend?: string;
  c_websiteUser?: string;
  c_websitePass?: string;
  c_websitePageId?: string;
  c_notObligedToCashRegisterLaw?: string;
  c_guestRatingActive?: string;
  c_grUseNetworkRatings?: string;
  c_grShowRatingInBookingEdit?: string;
  c_wishroom_module_active?: string;
  c_displayWishroomCharge?: string;
  c_beLocale_id?: string;
  c_autoSplitCateringRoomcharge?: string;
  c_ervAlwaysIncluded?: string;
  c_lastGuestReviewCheck?: string;
  c_channelManagerAutoCalc?: string;
  c_methodDefaultCatering?: string;
  c_methodOtherCatering?: string;
  c_dateFormat_id?: string;
  c_hideDailyTips?: string;
  c_smtpFailedSendingAttempt?: string;
  cc_defaultViewDays?: number;
}

export interface RoomplanRestrictions {
  seasonName: string;
  minStay: string;
  maxPersons: string;
  from: Date;
  until: Date;
}

export interface DateRange {
  start: Date;
  end: Date;
}
