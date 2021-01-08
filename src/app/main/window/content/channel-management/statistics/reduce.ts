import { GetStatisticsRequestParams, RawStatistics, Statistics } from './models';
import { StatisticsFilterData } from './statistics-filter/statistics-filter.component';

export function reduceStatistics(statistics: RawStatistics): Statistics {
  return {
    bookingId: +statistics.b_id,
    bookingNumber: statistics.b_bookingNo,
    bookingStatus: statistics.bs_name,
    guestLastName: statistics.c_lastName,
    status: statistics.status,
    validUntil: new Date(statistics.b_validUntilUK),
    arrivalDate: new Date(statistics.minFromDateUK),
    departureDate: new Date(statistics.maxFromDateUK),
    adults: +statistics.eb_noOfPersons,
    children: +statistics.eb_noOfChildren,
    childrenAges: statistics.eb_childrenAges ? statistics.eb_childrenAges.split(',').map(numStr => +numStr) : [],
    amount: +statistics.amount,
  };
}

export function prepareGetParams(filterData: StatisticsFilterData): GetStatisticsRequestParams {
  return {
    expiry: filterData.expiry
  };
}
