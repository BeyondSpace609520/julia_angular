import { parseDate } from '@/app/helpers/date';
import {
    CustomerItem, CustomerItemDetails, CustomerUser, LoginMessage,
    RawCustomerItem, RawCustomerItemDetails, RawCustomerUser, RawLoginMessage
} from './models';

export function reduceCustomerItem(c: RawCustomerItem): CustomerItem {
    return {
        id: +c.c_id,
        name: c.c_name,
        dbName: c.c_dbName,
        status: c.cs_name,
        nextBillDate: parseDate(c.c_nextBillDate)
    };
}

export function reduceCustomerItemDetails(c: RawCustomerItemDetails): CustomerItemDetails {
    return {
        id: +c.c_id,
        accountNo: c.c_accountNo,
        name: c.c_name,
        addressLine1: c.c_addressLine1,
        postCode: c.c_postCode,
        city: c.c_city,
        county: c.c_county,
        country: c.c_country,
        phoneNo: c.c_phoneNo,
        faxNo: c.c_faxNo,
        email: c.c_eMail,
        webUrl: c.c_webUrl,
        quicksEnabled: c.c_quicksEnabled === 'on',
        billingEnabled: c.c_billingEnabled === 'on',
        specialOfferEnabled: c.c_specialOfferEnabled === 'on',
        poweredByEnabled: c.c_poweredByEnabled === 'on',
        taxNo: c.c_taxNo,
        hotelSoftwareId: +c.c_hotelSoftware_id,
        noOfBeds: +c.c_noOfBeds,
        noOfRooms: +c.c_noOfRooms,
        daysOpenPerYear: c.c_daysOpenPerYear,
        generalLocation: c.c_generalLocation,
        openSeason: c.c_openSeason,
        category: c.c_category.split(' ') as ('private' | 'BnB' | 'hotel' | 'inn')[],
        categoryStars: +c.c_categoryStars,
        salutationId: +c.c_salutation_id,
        contactEmail: c.c_contactEMail,
        contactFirstName: c.c_contactFirstName,
        contactLastName: c.c_contactLastName,
        contactMobileNo: c.c_contactMobileNo,
        contactPhoneNo: c.c_contactPhoneNo,
        title: c.c_title,
        dbName: c.c_dbName,
        beRoomLevelPricingEnabled: c.c_beRoomLevelPricingEnabled === 'on',
        creationDate: parseDate(c.c_creationDate),
        isDefault: c.c_isDefault === 'on',
        customerStatusId: +c.c_customerStatus_id,
        meldewesen: c.c_meldewesen === 'on',
        onlineCheckIn: c.c_onlineCheckIn === 'on',
        resellerId: +c.c_reseller_id,
        serialNumber: c.c_serialNumber
    };
}

export function reduceCustomerUser(u: RawCustomerUser): CustomerUser {
    return {
        id: +u.aug_id,
        username: u.aug_userName,
        active: u.aug_active === 'on',
        lastLogin: parseDate(u.aug_lastLogin),
        lastIP: u.aug_lastLoginIP
    };
}

export function reduceLoginMessage(m: RawLoginMessage): LoginMessage {
    return {
        active: m.c_loginMessageActive === 'on',
        title: m.c_loginMessageTitle,
        message: m.c_loginMessage
    };
}

export function prepareLoginMessageBody(customerId: number, m: LoginMessage) {
    return {
        c_loginMessageActive: m.active ? 'on' : 'off',
        c_id: customerId,
        c_loginMessage: m.message,
        c_loginMessageTitle: m.title
    };
}
