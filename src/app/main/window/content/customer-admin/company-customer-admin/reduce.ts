// convert flat objects (provided by backend) with many properties to the object with nested objects
import { parseDate, stringifyDate } from '@/app/helpers/date';
import { FormDataService } from '@/app/main/shared/form-data.service';
import { CustomerBooking, CustomerDetail, RawCustomerBooking, RawCustomerDetail, RawCustomerDetailBody } from './models';

export function reduceCustomerDetail(c: RawCustomerDetail): CustomerDetail {
    return {
        id: c.c_id,
        accountNo: c.c_accountNo,
        salutation: c.c_salutation_id,
        title: c.c_title,
        firstName: c.c_firstName,
        lastName: c.c_lastName,
        email: c.c_eMailAddress,
        email2: c.c_eMailAddress2,
        channelEmail: c.c_channelEMailAddress,
        phoneNo: c.c_phoneNo,
        phoneNo2: c.c_phoneNo2,
        address: c.c_addressLine1,
        postCode: c.c_postCode,
        city: c.c_city,
        country: c.c_country_id,
        locale: c.c_locale_id,
        ip: c.c_ipAddress,
        creationDate: c.c_creationDate,
        birthday: parseDate(c.c_birthDay, false),
        identNo: c.c_identification,
        taxNumber: c.c_taxNo,
        internalInformation: c.c_comment,
        sendNewsletter: c.c_sendNewsLetter === 'on',
        sendSafeEmail: c.c_sendSafeJourneyMail === 'on',
        sendThankyouEmail: c.c_sendThankYouMail === 'on',
        sendPaymentsEmail: c.c_sendSafeJourneyPlusPaymentsMail === 'on',
        sendRegionalEvents: c.c_attachEventsPDF === 'on',
        anonymizationDate: c.anonymizationDate, // invalid date for parsing
        allowAutoAnonymization: c.c_autoAnonymize === '1'
    };
}

export function getDefaultDetail(fd: FormDataService): CustomerDetail {
    return {
        accountNo: '',
        salutation: fd.getDefaultSalutation(),
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        email2: '',
        channelEmail: '',
        phoneNo: '',
        phoneNo2: '',
        address: '',
        postCode: '',
        city: '',
        country: fd.getDefaultCountry(),
        locale: fd.getDefaultLocale(),
        ip: '',
        creationDate: '',
        birthday: null,
        identNo: '',
        taxNumber: '',
        internalInformation: '',
        sendNewsletter: false,
        sendSafeEmail: false,
        sendThankyouEmail: false,
        sendPaymentsEmail: false,
        sendRegionalEvents: false,
        anonymizationDate: '',
        allowAutoAnonymization: true
    };
}

export function inverseCustomerDetail(c: CustomerDetail): RawCustomerDetailBody {
    return {
        c_id: c.id,
        c_accountNo: c.accountNo,
        c_salutation_id: c.salutation,
        c_title: c.title,
        c_firstName: c.firstName,
        c_lastName: c.lastName,
        c_eMailAddress: c.email,
        c_eMailAddress2: c.email2,
        c_channelEMailAddress: c.channelEmail,
        c_phoneNo: c.phoneNo,
        c_phoneNo2: c.phoneNo2,
        c_addressLine1: c.address,
        c_postCode: c.postCode,
        c_city: c.city,
        c_country_id: c.country,
        c_locale_id: c.locale,
        c_birthDay: stringifyDate(c.birthday, false),
        c_identification: c.identNo,
        c_taxNo: c.taxNumber,
        c_comment: c.internalInformation,
        c_sendNewsLetter: c.sendNewsletter ? 'on' : 'off',
        c_sendSafeJourneyMail: c.sendSafeEmail ? 'on' : 'off',
        c_sendThankYouMail: c.sendThankyouEmail ? 'on' : 'off',
        c_sendSafeJourneyPlusPaymentsMail: c.sendPaymentsEmail ? 'on' : 'off',
        c_attachEventsPDF: c.sendRegionalEvents ? 'on' : 'off',
        c_autoAnonymize: c.allowAutoAnonymization ? '1' : '0'
    };
}

export function reduceCustomerBooking(b: RawCustomerBooking): CustomerBooking {
    return {
        id: +b.b_id,
        bookingNo: b.b_bookingNo,
        fromDate: parseDate(b.eb_fromDate, false),
        creationDate: parseDate(b.b_creationDate)
    };
}
