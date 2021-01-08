import { Trigger } from '@/app/main/models';
import { SearchData } from '../search-bar/search-bar.component';

export interface RawInteraction {
    bType: string;
    bs_name: string;
    c_city: string;
    c_firstName: string;
    c_lastName: string;
    ce_bookingNo: string;
    ce_booking_id: string;
    ce_creationDate: string;
    ce_creationDateNice: string;
    ce_eMailAddress: string;
    ce_firstReadDate: string | null;
    ce_firstReadDateNice: string;
    ce_id: string;
    ce_stdAttachmentPath: string;
    ce_subject: string;
    ce_text: string;
    eb_fromDateUKFormat: string;
    eb_id: string;
    eb_totalNet: string;
    erl_name: string;
    interactionType: string;
    isLatestStatus: Trigger;
    isCancelled: Trigger;
}

export interface Interaction {
    type: string;
    bsName: string;
    city: string;
    firstName: string;
    lastName: string;
    bookingNo: string;
    bookingId: number;
    creationDate: Date;
    emailAddress: string;
    firstReadDate: Date | null;
    id: number;
    stdAttachmentPath: string;
    subject: string;
    text: string;
    fromDate: Date;
    ebId: string;
    totalNet: string;
    name: string;
    interactionType: string;
    isLatestStatus: boolean;
    isCancelled: boolean;
}

export interface InteractionFilter {
    customerId?: number;
}

export type InteractionSearchData = SearchData & InteractionFilter;

export interface InteractionColumn {
    id: keyof Interaction;
    label: string;
    type?: 'string' | 'number' | 'date';
}
