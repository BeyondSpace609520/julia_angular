import { Trigger } from '@/app/main/models';
import { Interaction, InteractionSearchData, RawInteraction } from './models';
import { stringifyDate } from '@/app/helpers/date';

export function reduceInteraction(raw: RawInteraction): Interaction {
    return {
        type: raw.bType,
        bsName: raw.bs_name,
        city: raw.c_city,
        firstName: raw.c_firstName,
        lastName: raw.c_lastName,
        bookingNo: raw.ce_bookingNo,
        bookingId: +raw.ce_booking_id,
        creationDate: new Date(raw.ce_creationDate),
        emailAddress: raw.ce_eMailAddress,
        firstReadDate: raw.ce_firstReadDate ? new Date(raw.ce_firstReadDate) : null,
        id: +raw.ce_id,
        stdAttachmentPath: raw.ce_stdAttachmentPath,
        subject: raw.ce_subject,
        text: raw.ce_text,
        fromDate: new Date(raw.eb_fromDateUKFormat),
        ebId: raw.eb_id,
        totalNet: raw.eb_totalNet,
        name: raw.erl_name,
        interactionType: raw.interactionType,
        isLatestStatus: raw.isLatestStatus === 'on',
        isCancelled: raw.isCancelled === 'on'
    };
}

export function prepareGetInteractionsParams(searchData: InteractionSearchData) {
    const getCheckboxValue = (id: string): Trigger => {
        const target = searchData.checkboxes.find(ch => ch.id === id);

        return target && target.value ? 'on' : 'off';
    }

    return {
        fromDate: stringifyDate(searchData.from, false),
        untilDate: stringifyDate(searchData.to, false),
        showEN: getCheckboxValue('enquiries'),
        showAdmin: getCheckboxValue('admin'),
        showBO: getCheckboxValue('booking'),
        showWorkflow: getCheckboxValue('workflow'),
        showRE: getCheckboxValue('reservations'),
        c_id: searchData.customerId
    };
}
