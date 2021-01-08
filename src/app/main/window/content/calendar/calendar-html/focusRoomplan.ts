import { ViewService } from '@/app/main/view/view.service';

export async function focusRoomplan(viewService: ViewService): Promise<void> { // open or focus Roomplan window
  return viewService.focusViewById('calendarHTML');
}
