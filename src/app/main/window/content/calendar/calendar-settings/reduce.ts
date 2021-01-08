import { parseDate, stringifyDate } from '@/app/helpers/date';
import { CalendarSettings, Color, RawCalendarSettings, } from './models';

function decimalToColor(decimal: string): Color {
    let hex = Number(decimal).toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;
    return '#' + hex;
}

function colorToDecimal(color: Color): string {
  return parseInt(color.replace('#', ''), 16).toString();
}

export function reduceCalendarSettings(s: RawCalendarSettings): CalendarSettings {
    return {
        defaultRoomplan: s.c_defaultRoomplan,
        colors: {
            enquiry: decimalToColor(s.enquiryColor),
            reservation: decimalToColor(s.reservationColor),
            booking: decimalToColor(s.bookingColor),
            block: decimalToColor(s.blockColor),
            contingent: decimalToColor(s.contingentColor),
            invoiceCreatedIndicator: decimalToColor(s.invoiceCreatedIndicatorColor)
        },
        weeksColor: {
            monday: decimalToColor(s.cc_colorMonday),
            tuesday: decimalToColor(s.cc_colorTuesday),
            wednesday: decimalToColor(s.cc_colorWednesday),
            thursday: decimalToColor(s.cc_colorThursday),
            friday: decimalToColor(s.cc_colorFriday),
            saturday: decimalToColor(s.cc_colorSaturday),
            sunday: decimalToColor(s.cc_colorSunday),
        },
        periodsColor: s.calendarCustomPeriodColors ? s.calendarCustomPeriodColors.map((p: RawCalendarSettings['calendarCustomPeriodColors'][0]) => ({
            id: +p.ccpc_id,
            name: p.ccpc_name,
            fromDate: parseDate(p.ccpc_fromDate),
            untilDate: parseDate(p.ccpc_untilDate),
            color: decimalToColor(p.ccpc_color)
        } as CalendarSettings['periodsColor'][0])) : [],
        useSpecialColoring: s.cc_useSpecialColoring === 'on'
    };
}

export function prepareCalendarSettingsBody(s: CalendarSettings): RawCalendarSettings {
    return {
        c_defaultRoomplan: s.defaultRoomplan,
        enquiryColor: colorToDecimal(s.colors.enquiry),
        reservationColor: colorToDecimal(s.colors.reservation),
        bookingColor: colorToDecimal(s.colors.booking),
        blockColor: colorToDecimal(s.colors.block),
        contingentColor: colorToDecimal(s.colors.contingent),
        invoiceCreatedIndicatorColor: colorToDecimal(s.colors.invoiceCreatedIndicator),
        cc_colorMonday: colorToDecimal(s.weeksColor.monday),
        cc_colorTuesday: colorToDecimal(s.weeksColor.tuesday),
        cc_colorWednesday: colorToDecimal(s.weeksColor.wednesday),
        cc_colorThursday: colorToDecimal(s.weeksColor.thursday),
        cc_colorFriday: colorToDecimal(s.weeksColor.friday),
        cc_colorSaturday: colorToDecimal(s.weeksColor.saturday),
        cc_colorSunday: colorToDecimal(s.weeksColor.sunday),
        calendarCustomPeriodColors: s.periodsColor.map((p: CalendarSettings['periodsColor'][0]) => ({
            ccpc_id: String(p.id),
            ccpc_name: p.name,
            ccpc_fromDate: stringifyDate(p.fromDate),
            ccpc_untilDate: stringifyDate(p.untilDate),
            ccpc_color: colorToDecimal(p.color)
        } as RawCalendarSettings['calendarCustomPeriodColors'][0])),
        cc_useSpecialColoring: s.useSpecialColoring ? 'on' : 'off',
        dummy: 'dummy'
    };
}
