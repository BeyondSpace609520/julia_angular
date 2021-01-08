import { TranslateService } from '@ngx-translate/core';

import { ApiClient } from '@/app/helpers/api-client';
import { ViewService } from '@/app/main/view/view.service';
import {
  MoveToRoomplanEvent,
  SendToRoomplanEvent,
  ShowRoomplanMessageEvent,
  StartLoadingAnimationRoomplanEvent
} from '@/app/main/window/content/calendar/calendar-html/events';
import { focusRoomplan } from '@/app/main/window/content/calendar/calendar-html/focusRoomplan';
import { BookingStatus, Enquiry, FeratelEnquiry } from '@/app/main/window/content/channel-management/enquiry-pool/models';
import { EventBusService } from '@/app/main/window/shared/event-bus';

export async function assignEnquiry(
  enquiry: Enquiry,
  viewService: ViewService,
  apiClient: ApiClient,
  eventBusService: EventBusService,
  translate: TranslateService,
): Promise<void> {
  await focusRoomplan(viewService);
  eventBusService.emit<StartLoadingAnimationRoomplanEvent>('startLoadingAnimationRoomplan', null);
  const resp = await apiClient.autoCreateEnquiry(enquiry.raw, null, false).toPromise();
  const firstFailedAttempt = resp.status === 'NOTHINGFOUND';
  let replyResponse;

  // https://trello.com/c/rx74xI8p/66-channel-management-enquiry-pool-fixes-changes (item 14)
  // https://trello.com/c/rx74xI8p/66-channel-management-enquiry-pool-fixes-changes#comment-5d26eb7495e84f66a0b7c19d
  if (firstFailedAttempt) {
    replyResponse = await apiClient.autoCreateEnquiry(enquiry.raw, null, true).toPromise();
    const secondFailedAttempt = replyResponse.status === 'NOTHINGFOUND';

    if (secondFailedAttempt) {
      await focusRoomplan(viewService);
      const text = await translate.get('BackEnd_WikiLanguage.eqp_noRoomsFound').toPromise();

      eventBusService.emit<ShowRoomplanMessageEvent>('showRoomplanMessage', text);
    }
  }

  eventBusService.emit<SendToRoomplanEvent>('sendToRoomplan', {
    method: 'enquiryFromEnquiryPool',
    object: {
      additionalMessage: firstFailedAttempt ? await translate.get('BackEnd_WikiLanguage.eqp_roomsDontMatch').toPromise() : '',
      searchResult: !firstFailedAttempt ? resp : replyResponse,
      ep_id: enquiry.id,
      b_locale_id: enquiry.locale,
      b_comment: enquiry.comment,
    }
  });
}

export async function openEnquiry(
  enquiry: Enquiry,
  index: number,
  viewService: ViewService,
  eventBus: EventBusService
): Promise<void> {
  const { bookingIds, minFromDates, names } = enquiry;
  const [arrivalDate, id, type] = [minFromDates[index], bookingIds[index], names[index]];
  await openEnquiryInRoomplan(id, arrivalDate, type, viewService, eventBus);
}

export async function openFeratelEnquiry(
  enquiry: FeratelEnquiry,
  viewService: ViewService,
  eventBus: EventBusService
) {
  const bookingStatusId = enquiry.bookingStatusId ? BookingStatus[enquiry.bookingStatusId] : null;
  await openEnquiryInRoomplan(enquiry.targetBookingId, enquiry.targetArrival, bookingStatusId, viewService, eventBus);
}

async function openEnquiryInRoomplan(
  id: number | null,
  arrivalDate: Date | null,
  type: string | null,
  viewService: ViewService,
  eventBus: EventBusService
): Promise<void> {
  await focusRoomplan(viewService);

  if (arrivalDate === null || id === null || type === null) {
    throw new Error('Cannot open roomplan. The params contain null');
  }

  eventBus.emit<MoveToRoomplanEvent>('moveToRoomplan', { arrivalDate, id, type });
}
