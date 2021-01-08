
export interface Customer {
    id: number;
    accountNo: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    webUrl: string | null;
    address: string;
    birthday: Date | null;
    birthCity: string | null;
    addressAdditional: string | null;
    phoneNo: string;
    phoneNoAdditional: string | null;
    faxNo: string | null;
    carRegNo: string | null;
    city: string;
    cityAdditional: string | null;
    region: string | null;
    taxNo: string;
    localeId: string;
    company: string;
    companyRegNo: string | null;
    countryId: number | null;
    country?: number | null;
    postCode: string;
    salutationId: number;
    salutation?: number;
    nationalityId: number | null;
    documentTypeId: number | null;
    documentNo: string | null;
    noOfStays: string | null;
    postBox: string | null;
    comment: string | null;
    occupation: string | null;
    occupationBranch: string | null;
    characteristicsARR?: number[];
}

