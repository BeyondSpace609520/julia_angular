import { ViewService } from '@/app/main/view/view.service';

export function openRoomsApartments(viewService: ViewService, properties?: RoomsApartmentsProperties): void {
  viewService.openViewWithProperties('stdRoomsAndApartments', properties || {});
}

export interface RoomsApartmentsProperties {
  preselectRoomId?: number;
  preselectTabId?: 'images' | 'detail';
}
