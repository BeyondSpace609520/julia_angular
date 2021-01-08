import { Trigger } from '@/app/main/models';

export interface RawReportingClientProvider {
  grp_id: string;
  grp_name: string;
  grp_code: string;
  grp_xmlVersion: string;
  grp_printLink: Trigger;
  grp_active: Trigger;
  grp_prepareForm: Trigger;
  grp_sendLetterCountryCode: Trigger;
  grp_taxTypesAreSynced: Trigger;
}

export interface ReportingClientProvider {
  id: number;
  name: string;
  code: string;
  xmlVersion: number;
  printLink: boolean;
  active: boolean;
  prepareForm: boolean;
  sendLetterCountryCode: boolean;
  taxTypesAreSynced: boolean;
}

export interface CompanyDetailsSaveData {
  cf_desklineEdition: Trigger;
  grp_id: number;
  rfgs_altLink: string;
  rfgs_businessIndicator: string;
  rfgs_clientCode: string;
  rfgs_code: string;
  rfgs_communityNumber: string;
  rfgs_emailToFeratel: Trigger;
  rfgs_guestCardSeparate: Trigger;
  rfgs_id: number;
  rfgs_mcNumber: string;
  rfgs_name: string;
  rfgs_password: string;
  rfgs_username: string;
  saveDesklineEdition: Trigger;
}

export interface CompanyDetailsFormValues {
  advanceBookingPossible: boolean;
  alternativeProviderLink: string;
  businessIndicator: string;
  clientCode: string;
  code: string;
  communityNumber: string;
  desklineEditionV3: boolean;
  emailToFeratel: boolean;
  guestCardSeparate: boolean;
  guestRegistrationProviderId: ReportingClientProvider['id'];
  mcNumber: string;
  name: string;
  password: string;
  username: string;
}

export interface RawNumberRanges {
  maxRgNumber: string;
  enableAddButton: Trigger;
  disableNumberRangeEditing: Trigger;
  ranges: RawNumberRange[];
}

export interface NumberRanges {
  disableNumberRangeEditing: boolean;
  enableAddButton: boolean;
  maxRgNumber: number;
  ranges: NumberRange[];
}

export interface RawNumberRange {
  rfnr_id: string;
  rfnr_from: string;
  rfnr_until: string;
  enabled?: Trigger;
}

export interface NumberRange {
  id: number;
  start: number;
  end: number;
  enabled?: boolean;
}
