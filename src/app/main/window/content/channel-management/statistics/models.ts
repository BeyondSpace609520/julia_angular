export interface RawStatistics {
  b_id: string;
  b_bookingNo: string;
  bs_name: string;
  c_lastName: string;
  status: string;
  b_validUntil: string;
  b_validUntilUK: string;
  minFromDate: string;
  minFromDateUK: string;
  maxFromDate: string;
  maxFromDateUK: string;
  eb_noOfPersons: string;
  eb_noOfChildren: string;
  eb_childrenAges: string;
  eb_totalNet: string;
  amount: string;
}

export interface Statistics {
  bookingId: number;
  bookingNumber: string;
  bookingStatus: string;
  guestLastName: string;
  status: string;
  validUntil: Date;
  arrivalDate: Date;
  departureDate: Date;
  adults: number;
  children: number;
  childrenAges: number[];
  amount: number;
}

export interface GetStatisticsRequestParams {
  expiry: string;
}
