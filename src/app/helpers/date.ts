import dayjs from 'dayjs';
// import 'dayjs/locale/de';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

function getFormat(appendTime: boolean) {
    return `YYYY-MM-DD${appendTime ? ' hh:mm:ss' : ''}`;
}

export function parseDate(date: string, appendTime?: boolean): Date;
export function parseDate(date: null, appendTime?: boolean): null;
export function parseDate(date: string | null, appendTime?: boolean): null | Date;
export function parseDate(date: string | null, format: string): Date | null;
export function parseDate(date: string | null, appendTimeFormat: boolean | string = true): null | Date {
    return date && date !== '0000-00-00 00:00:00'
      ? dayjs(
          date,
          typeof appendTimeFormat === 'string'
            ? appendTimeFormat
            : getFormat(appendTimeFormat)
        ).toDate()
      : null;
}

export function stringifyDate(date: Date, appendTime?: boolean): string;
export function stringifyDate(date: null, appendTime?: boolean): null;
export function stringifyDate(date: Date | string | null, appendTime?: boolean): string | null;
export function stringifyDate(date: Date | string | null, appendTime = true): string | null {
  if (!date) {
    return null;
  } else if (dayjs(date, 'DD.MM.YYYY').isValid()) {
    // try first german date format
    // to ensure not to fall for MM.DD.YYYY (month first)
    return dayjs(date, 'DD.MM.YYYY').format(getFormat(appendTime));
  } else {
    // try any other format
    return dayjs(date).format(getFormat(appendTime));
  }
}
