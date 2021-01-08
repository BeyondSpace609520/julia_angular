export interface RawContract {
    b_bookingNo: string;
    b_id: string;
    c_eMailAddress: string;
    c_firstName: string;
    c_lastName: string;
    contractCodeText: string | null;
    contractParameter: string | null;
    ic_date: string;
    ic_id: string;
    io_amount: string;
    io_date: string | null;
    io_id: string;
    minArrivalDate: string | null;
    minArrivalDateUK: string;
    offerCode: string | null;
    offerCodeText: string | null;
    offerCodeTextText: string | null;
    policyNumber: string;
    token: string;
    totalAmountOfInsurance: string;
    totalBookingAmount: string;
}

export interface Contract {
    id: string;
    bookingNo: string;
    arrivalDate: Date | null;
    offerId: number;
    offerDate: Date | null;
    contractId: number;
    contractDate: Date | null;
    policyNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    amount: number;
    bookingAmount: number;
    offerCode: string | null;
    offerCodeText: string | null;
    contractCodeText: string | null;
    offerCodeTextText: string | null;
    contractParameter: string | null;
}
