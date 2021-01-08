import { parseDate } from '@/app/helpers/date';
import { BookingDetail, BookingRoom, GuestRelatedDetail, RawBookingDetail, RawBookingRoom, RawGuestRelatedDetail } from './models';

export function reduceBookingDetail(b: RawBookingDetail): BookingDetail {
    return {
        id: +b.b_id,
        bookingNo: b.b_bookingNo,
        cancelled: b.cancelled === 'on',
        comment: b.b_comment,
        commentInternal: b.b_commentInternal,
        creationDate: parseDate(b.b_creationDate, 'DD.MM.YYYY hh:mm:ss'),
        ip: b.b_ipAddress,
        name: b.bs_name,
        status: b.bs_name,
        pinCode: b.b_selfAdminPinCode,
        source: b.b_source,
        sourcePlatform: b.b_sourcePlatform,
        paymentMethod: b.paymentMethod,
        paymentType: b.pml_name,
        depositAmount: +b.b_prepaymentAmount,
        creditCard: b.creditCardDetail ? {
            token: b.creditCardDetail.cc_token,
            holder: b.creditCardDetail.cc_holderName,
            number: b.creditCardDetail.cc_number,
            type: b.creditCardDetail.cct_name,
            verificationCode: b.creditCardDetail.cc_verificationCode,
            expiryAt: `${b.creditCardDetail.cc_expiryDateMonth} / ${b.creditCardDetail.cc_expiryDateYear}`,
            pciExpired: b.creditCardDetail.pciExpired === 'on'
        } : undefined
    };
}

export function reduceGuestRelatedDetail(d: RawGuestRelatedDetail): GuestRelatedDetail {
    return {
        agreedAt: parseDate(d.agreedAt),
        docs: Array.isArray(d.legalDocs) ? d.legalDocs.map(doc => ({
            id: +doc.id,
            name: doc.name,
            agreed: doc.agreed,
            code: doc.code,
            url: doc.docUrl,
            version: doc.version
        }) as GuestRelatedDetail['docs'][0]) : []
    };
}

export function reduceBookingRooom(r: RawBookingRoom): BookingRoom {
    return {
        uniqueNo: r.e_uniqueNo,
        fromDate: parseDate(r.eb_fromDate),
        untilDate: parseDate(r.eb_untilDate),
        nightsStay: +r.eb_nightsStay,
        noOfPersons: +r.eb_noOfPersons,
        noOfChildren: +r.eb_noOfChildren,
        noOfPetsSmall: +r.eb_noOfPetsSmall,
        noOfPetsLarge: +r.eb_noOfPetsLarge,
        childrenAges: r.eb_childrenAges,
        totalPriceAdults: +r.eb_totalEntityPriceAdults,
        totalPriceChildren: +r.eb_totalEntityPriceChildren,
        totalServiceCharge: +r.eb_totalServiceCharge,
        totalVisitorsTax: +r.eb_totalVisitorsTax,
        totalPetCharge: +r.eb_totalPetCharge,
        totalCleanUpCharge: +r.eb_totalCleanUpCharge,
        totalDiscount: +r.eb_totalDiscount,
        totalShortStayCharge: +r.eb_totalShortStayCharge,
        totalNet: +r.eb_totalNet
    };
}
