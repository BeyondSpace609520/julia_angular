import { ViewService } from '@/app/main/view/view.service';

export function openRoomCategory(viewService: ViewService, properties?: RoomCategoryProperties) {
  viewService.openViewWithProperties('entityGroup', properties || {});
}

export interface RoomCategoryProperties {
  preselectRoomId?: number;
  preselectRoomCategoryId?: number;
  preselectTabId?: 'images' | 'features';
}
