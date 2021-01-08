import { Field } from '@/app/main/window/shared/forms/builder';
import { CustomerItemDetails } from '../../models';

export type CustomerProp = keyof CustomerItemDetails;
export type Resources = 'salutations' | 'hotels' | 'resellers' | 'statuses' | 'locations' | 'seasons' | 'categories';
export type Fields = (Field<CustomerProp, Resources> | ['date', string, CustomerProp])[];

export const contactFields: Fields = [
    ['select', 'EBP_Salutation', 'salutationId', { resource: 'salutations' }],
    ['input', 'EBP_Title', 'title'],
    ['input', 'RCAD_contactFirstName', 'contactFirstName'],
    ['input', 'RCAD_contactLastName', 'contactLastName'],
    ['input', 'RCAD_contactPhoneNo', 'contactPhoneNo'],
    ['input', 'RCAD_contactMobileNo', 'contactMobileNo'],
    ['input', 'RCAD_contactEMail', 'contactEmail'],
];

export const bottomFields: Fields = [
    ['checkbox', 'RCAD_QuicksEnabled', 'quicksEnabled'],
    ['checkbox', 'RCAD_BillingEnabled', 'billingEnabled'],
    ['checkbox', 'RCAD_SpecialOffer', 'specialOfferEnabled'],
    ['checkbox', 'RCAD_PoweredByEnabled', 'poweredByEnabled'],
    ['checkbox', 'Meldewesen', 'meldewesen'],
    ['checkbox', 'saraOnlineCheckinHeader', 'onlineCheckIn'],
    ['checkbox', 'RCAD_RoomLevelPricing', 'beRoomLevelPricingEnabled'],
    ['checkbox', 'JustSendDefaultEmails', 'isDefault'],
];

export const additionalFields: Fields = [
    ['select', 'RCAD_ResellerName', 'resellerId', { resource: 'resellers' }],
    ['select', 'RCAD_customerStatus', 'customerStatusId', { resource: 'statuses' }],
    ['input', 'RCAD_Database', 'dbName'],
    ['input', 'RCAD_SerialNumber', 'serialNumber']
];

export const getMainFields = (onClickEmail: () => void, onClickWebsite: () => void): Fields[] => [
    [
        ['input', 'RCAD_accountNo', 'accountNo'],
        ['input', 'RCAD_name', 'name'],
        ['input', 'RCAD_addressLine1', 'addressLine1'],
        ['input', 'RCAD_postCode', 'postCode'],
        ['input', 'RCAD_city', 'city'],
        ['input', 'RCAD_county', 'county'],
        ['input', 'RCAD_country', 'country'],
        ['input', 'RCAD_phoneNo', 'phoneNo'],
        ['input', 'RCAD_faxNo', 'faxNo'],
        ['input', 'RCAD_eMail', 'email', { onClickLabel: onClickEmail }],
        ['input', 'RCAD_webUrl', 'webUrl', { onClickLabel: onClickWebsite }]
    ],
    [
        ['input', 'RCAD_TaxNo', 'taxNo'],
        ['select', 'RCAD_HotelApp', 'hotelSoftwareId', { resource: 'hotels' }],
        ['input', 'RCAD_NoOfBeds', 'noOfBeds'],
        ['input', 'RCAD_NoOfRooms', 'noOfRooms'],
        ['input', 'RCAD_DaysOpenPerYear', 'daysOpenPerYear'],
        ['select', 'RCAD_Location', 'generalLocation', { resource: 'locations' }],
        ['select', 'RCAD_Season', 'openSeason', { resource: 'seasons' }],
        ['multiselect', 'RCAD_Category', 'category', { resource: 'categories' }],
        ['input', 'RCAD_CategoryHotelStars', 'categoryStars']
    ]
];
