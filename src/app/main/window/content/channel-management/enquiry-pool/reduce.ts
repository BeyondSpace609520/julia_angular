import { parseDate, stringifyDate } from '@/app/helpers/date';
import { Trigger } from '@/app/main/models';
import { SearchData } from '../../../shared/search-bar/search-bar.component';
import { Enquiry, FeratelEnquiry, GetRequestParams, RawEnquiry, RawFeratelEnquiry } from './models';

export function reduceEnquiry(en: RawEnquiry): Enquiry {
    return {
        id: +en.ep_id,
        status: en.ep_status as Enquiry['status'],
        source: en.ep_source,
        name: en.ep_name,
        createdDate: parseDate(en.ep_inputDate, 'DD.MM.YYYY hh:mm:ss'),
        arrival: parseDate(en.ep_arrival),
        start: parseDate(en.epe_rangeFromDate, 'DD.MM.YYYY'),
        end: parseDate(en.epe_rangeUntilDate, 'DD.MM.YYYY'),
        nights: +en.ep_nights,
        adults: +en.ep_noOfPersons,
        children: +en.ep_noOfChildren,
        age: +en.ep_childAges,
        price: en.ep_price,
        comment: en.ep_comment,
        bookingIds: [
          en.ep_booking_id ? +en.ep_booking_id : null,
          en.ep_booking_id0 ? +en.ep_booking_id0 : null,
          en.ep_booking_id1 ? +en.ep_booking_id1 : null,
          en.ep_booking_id2 ? +en.ep_booking_id2 : null
        ],
        minFromDates: [
            parseDate(en.minFromDate, false),
            parseDate(en.minFromDate0, false),
            parseDate(en.minFromDate1, false),
            parseDate(en.minFromDate2, false)
        ],
        names: [en.bs_name, en.bs_name0, en.bs_name1, en.bs_name2],
        isAirbnb: en.isAirbnb === 'on',
        locale: en.ep_locale_id,
        bookingStatusId: en.b_bookingStatus_id ? +en.b_bookingStatus_id : null,
        companyInfo: '', // required for precomputed info
        raw: en,
    };
}

export function reduceFeratelEnquiry(raw: RawFeratelEnquiry): FeratelEnquiry {
  return {
    ...reduceEnquiry(raw),
    targetArrival: raw.target_arrivalDate ? new Date(raw.target_arrivalDate) : null,
    targetBookingId: +raw.target_booking_id
  };
}

export function prepareGetParams(searchData: SearchData, dateFilterOption: GetRequestParams['dateFilterOption']): GetRequestParams {
    const getCheckboxValue = (id: string): Trigger =>
        (searchData.checkboxes.find(ch => ch.id === id) as SearchData['checkboxes'][0]).value ? 'on' : 'off';

    return {
        fromDate: stringifyDate(searchData.from, false),
        untilDate: stringifyDate(searchData.to, false),
        autoCHK: getCheckboxValue('autoAnswered'),
        manualCHK: getCheckboxValue('answered'),
        openCHK: getCheckboxValue('open'),
        cancelledCHK: getCheckboxValue('declined'),
        dateFilterOption
    };
}
