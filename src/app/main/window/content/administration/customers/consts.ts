import { CustomerItemStatus } from './models';

export const Colors: {[key in CustomerItemStatus]: string; } = {
    Online: '#006600',
    Demo: '#CCCCCC',
    Gekündigt: '#FF0000',
    Test: '#336699',
    Bestellung: '#3399FF',
    Datenerfassung: '#0033FF',
    Einrichtung: '#FF9900',
    Einschulung: '#99CC00',
    ReadyForOnline: '#33CC00',
    Blank: '#000000',
};
