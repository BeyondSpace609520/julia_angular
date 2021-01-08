import {
  NumberRange,
  NumberRanges, RawNumberRange,
  RawNumberRanges,
  RawReportingClientProvider,
  ReportingClientProvider
} from '@/app/main/window/content/customer-admin/guest-registration-config/models';

export function reduceReportingClientProvider(raw: RawReportingClientProvider): ReportingClientProvider {
  return {
    id: +raw.grp_id,
    active: raw.grp_active === 'on',
    code: raw.grp_code,
    name: raw.grp_name,
    prepareForm: raw.grp_prepareForm === 'on',
    printLink: raw.grp_printLink === 'on',
    sendLetterCountryCode: raw.grp_sendLetterCountryCode === 'on',
    taxTypesAreSynced: raw.grp_taxTypesAreSynced === 'on',
    xmlVersion: +raw.grp_xmlVersion
  };
}

export function reduceNumberRanges(raw: RawNumberRanges): NumberRanges {
  return {
    disableNumberRangeEditing: raw.disableNumberRangeEditing === 'on',
    enableAddButton: raw.enableAddButton === 'on',
    maxRgNumber: +raw.maxRgNumber,
    ranges: raw.ranges ? raw.ranges.map(reduceNumberRange) : []
  };
}

export function reduceNumberRange(raw: RawNumberRange): NumberRange {
  return {
    id: +raw.rfnr_id,
    enabled: raw.enabled === 'on',
    end: +raw.rfnr_until,
    start: +raw.rfnr_from
  };
}

export function prepareNumberRange(id: number, start: number, end: number): RawNumberRange {
  return {
    rfnr_id: String(id),
    rfnr_from: String(start),
    rfnr_until: String(end)
  };
}
