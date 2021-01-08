import { Trigger } from '@/app/main/models';

export interface RawCalendarSettings {
    dummy: string;
    enquiryColor: string;
    reservationColor: string;
    bookingColor: string;
    blockColor: string;
    contingentColor: string;
    invoiceCreatedIndicatorColor: string;
    c_defaultRoomplan: string;
    cc_colorMonday: string;
    cc_colorTuesday: string;
    cc_colorWednesday: string;
    cc_colorThursday: string;
    cc_colorFriday: string;
    cc_colorSaturday: string;
    cc_colorSunday: string;
    calendarCustomPeriodColors: {
        ccpc_id: string;
        ccpc_name: string;
        ccpc_fromDate: string;
        ccpc_untilDate: string;
        ccpc_color: string;
    }[];
    cc_useSpecialColoring: Trigger;
}

export type Color = string;

export interface CalendarSettings {
    defaultRoomplan: string;
    colors: {
        enquiry: Color;
        reservation: Color;
        booking: Color;
        block: Color;
        contingent: Color;
        invoiceCreatedIndicator: Color;
    };
    weeksColor: {
        monday: Color;
        tuesday: Color;
        wednesday: Color;
        thursday: Color;
        friday: Color;
        saturday: Color;
        sunday: Color;
    };
    periodsColor: {
        id: number | null;
        name: string;
        fromDate: Date;
        untilDate: Date;
        color: Color;
        _tempId?: number;
    }[];
    useSpecialColoring: boolean;
}

export interface ICSEvent {
    startDate?: Date;
    endDate?: Date;
    description?: string;
    summary?: string;
    location?: string;
}
