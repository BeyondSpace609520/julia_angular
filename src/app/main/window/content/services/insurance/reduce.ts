import { parseDate, stringifyDate } from '@/app/helpers/date';
import { SearchData } from '../../../shared/search-bar/search-bar.component';
import { Contract, RawContract } from './models';

export function reduceContract(c: RawContract): Contract {
    return {
        id: c.b_id,
        bookingNo: c.b_bookingNo,
        arrivalDate: parseDate(c.minArrivalDate, 'DD.MM.YYYY'),
        policyNumber: c.policyNumber,
        offerId: +c.io_id,
        offerDate: parseDate(c.io_date, 'DD.MM.YYYY hh:mm:ss'),
        contractId: +c.ic_id,
        contractDate: parseDate(c.ic_date, 'DD.MM.YYYY hh:mm:ss'),
        firstName: c.c_firstName,
        lastName: c.c_lastName,
        email: c.c_eMailAddress,
        amount: +c.io_amount,
        bookingAmount: +c.totalBookingAmount,
        contractCodeText: c.contractCodeText,
        offerCode: c.offerCode,
        offerCodeText: c.offerCodeText,
        offerCodeTextText: c.offerCodeTextText,
        contractParameter: c.contractParameter,
    };
}


export function prepareOffersParams(searchData: SearchData) {
    return {
        fromDate: stringifyDate(searchData.from, false),
        untilDate: stringifyDate(searchData.to, false)
    };
}
