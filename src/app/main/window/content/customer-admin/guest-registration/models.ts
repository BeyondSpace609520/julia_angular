import { Trigger } from '@/app/main/models';
import { FormOption } from '@/app/main/shared/form-data.service';
import { GuestsCategory } from '../create-registration-form/models';

export interface RawHotelRegistrationRecord {
  rfgs_id: string;
  rfgs_name: string;
  rfgs_guestRegistrationProvider_id: string;
  rfgs_mcNumber: string;
  rfgs_username: string;
  rfgs_password: string;
  rfgs_communityNumber: string;
  rfgs_businessIndicator: string;
  rfgs_clientCode: string;
  rfgs_code: string;
  rfgs_canDoPrepareForm: Trigger;
  rfgs_active: Trigger;
  rfgs_altLink: string;
  rfgs_sortOrder: string;
  rfgs_guestCardSeparate: Trigger;
  rfgs_dbCode: null | string;
  rfgs_dbOv: null | string;
  rfgs_guestCardPrintLink: null | string;
  rfgs_companyCode: string;
  rfgs_emailToFeratel: Trigger;
  grp_id: string;
  prepareFormPossible: Trigger;
  grp_printLink: Trigger;
  cf_desklineEdition: string;
  companyCode: string;
}

export interface HotelRegistrationRecord {
  id: number;
  advanceBookingPossible: boolean;
  allowTravelGroup: boolean;
  alternativeProviderLink: string;
  businessIndicator: string;
  canProviderPrintGuestCard: boolean;
  clientCode: string;
  code: string;
  companyCode: string;
  communityNumber: string;
  desklineEditionV3: boolean;
  emailToFeratel: boolean;
  guestCardPrintLink: string | null;
  guestCardSeparate: boolean;
  guestRegistrationProviderId: number;
  hasGuestCard: boolean;
  mcNumber: string;
  name: string;
  needGuestCard: boolean;
  password: string;
  printLink: boolean;
  raw: RawHotelRegistrationRecord;
  sortOrder: number;
  strictValidation: boolean;
  username: string;
}


export interface RawBasicGuestRegistrationForm {
  rg_id: string;
  rg_booking_id: string;
  rg_arrived: Trigger;
  rg_departed: Trigger;
  rg_errorMsgAtRetry: null | string;
  rg_noOfPersons: string;
  rg_number: string;
  rg_numberInternal: null | string;
  rg_numberInternalDB: null | string;
  rg_restoreInformation: null | string;
  rg_screwed: Trigger;
  rg_travelPurpose: null | TravelPurpose;
}

export interface RawGuestRegistrationForm extends RawBasicGuestRegistrationForm {
  rg_fromDate: string;
  rg_untilDate: null | string;
  rg_plannedUntilDate: string;
  rfgs_guestRegistrationProvider_id: string;
  rg_lastSendDate: string;
  departed_rg_id: string | null;
  rg_registrationFormGeneralSettings_id: string;
  rg_registrationType_id: string;
}


export interface RawGuestRegistrationFormDetail extends RawBasicGuestRegistrationForm {
  rg_fromDateUK: string;
  rg_untilDateUK: null | string;
  rg_plannedUntilDateUK: string;
  c_lastName: string;
  customerAddress: string;
  cbrf_adultNO: string;
  cbrf_childNO: string;
  customerCountry: string;
  rtl_value: string;
  cancelled: string;
  regformPrintEnabled: Trigger;
  guestcardPrintEnabled: Trigger;
  customerNationality: string;
}

export interface RawGuestRegistrationItem {
  b_id: string;
  bs_name: string;
  c_lastName: string;
  completeGuestData: Trigger;
  minArrival: string;
  minArrivalUK: string;
  newRegform: Trigger;
  nights: string;
  numAdults: number;
  numChildren: number;
  numDeRegistered: string;
  numPersons: string;
  numRegistered: string;
  regForms?: RawGuestRegistrationForm[];
  roomCount: string;
  screwedRgExists: Trigger;
}

export interface BasicGuestRegistrationForm {
  id: number;
  bookingId: number;
  errorMessage: string | null;
  restoreInformation: string | null;
  number: string;
  arrived: boolean;
  departed: boolean;
  fromDate: Date;
  plannedUntilDate: Date;
  untilDate: Date | null;
  numberInternal: null | string;
  travelPurpose: TravelPurpose | null;
}
export interface GuestRegistrationForm extends BasicGuestRegistrationForm {
  registrationTypeId: number;
  strictValidation?: boolean;
  needGuestCard?: boolean;
  canForceDeparture?: boolean;
  detailGroupRequired?: boolean;
  providerAvs?: boolean;
  guestRegistrationProviderId: null | number;
  guestRegistrationSettingsId: null | number;
}

export interface GuestRegistrationFormDetail extends BasicGuestRegistrationForm {
  lastName: string;
  customerAddress: string;
  customerNationality: string;
  customerCountry: string;
  adultNO: null | number;
  childNO: null | number;
  value: string;
  cancelled: string;
  regformPrintEnabled: boolean;
  guestcardPrintEnabled: boolean;
  noOfPersons: number;
  type: string;
}

export interface GuestRegistrationItem {
  bookingId: number;
  arrival: Date;
  name: string;
  lastName: string;
  rooms: number;
  nights: number;
  persons: string;
  registered: string;
  checkout: string;
  completeGuestData: boolean;
  screwedRgExists: boolean;
  regForms: GuestRegistrationForm[];
  canCreateRegForm: boolean;
}

export interface RawRegistrationType {
  rtl_value: string;
  rtl_registrationType_id: string;
}

export type Status = 'all' | 'arrived' | 'departed' | 'notArrived';
export type RegistrationType = FormOption<number> & {
  category: GuestsCategory;
};

export enum ViewMode {
  OVERVIEW = '1',
  IN_PREPARATION = '2',
  ARRIVED = '3',
  DEPARTED = '4'
}

export interface TableField<T> {
  name: keyof T;
  label: string;
  type?: 'date';
  width?: number;
  widthIsPercent?: boolean;
}

export type TravelPurpose = 'holiday' | 'cure' | 'business' | 'sport';
