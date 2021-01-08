import { SendToRoomplanEvent } from '@/app/main/window/content/calendar/calendar-html/events';
import { EventBusService } from '@/app/main/window/shared/event-bus';

export function sendRoomplanUpdate(eventBusService: EventBusService, method: string): void {
  eventBusService.emit<SendToRoomplanEvent>(
    'sendToRoomplan',
    {
      method,
      object: {
        status: 'ok'
      }
    }
  );
}
