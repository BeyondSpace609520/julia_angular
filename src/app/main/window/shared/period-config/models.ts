export interface DaysState {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export interface SeasonPeriodConfig {
    arrival: DaysState;
    departure: DaysState;
    allowBooking: boolean;
    allowEnquiry: boolean;
    allowReservation: boolean;
    maxStay: number;
    minStay: number;
    useLongStayDiscount: boolean | null;
    useNightsMultiple: boolean;
}
