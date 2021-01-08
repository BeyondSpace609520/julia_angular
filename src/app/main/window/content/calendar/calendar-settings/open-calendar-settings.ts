import { ViewService } from '@/app/main/view/view.service';

export function openCalendarSettings(viewService: ViewService): void {
  viewService.openViewById('calendarSettings');
}
