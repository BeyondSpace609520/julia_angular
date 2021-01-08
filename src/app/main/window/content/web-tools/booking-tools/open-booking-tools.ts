import { ViewService } from '@/app/main/view/view.service';

export function openBookingTools(viewService: ViewService, properties?: BookingToolsProperties) {
  if (properties && properties.tabNumber && isNaN(properties.tabNumber)) {
    properties.tabNumber = undefined;
  }
  viewService.openViewWithProperties('openBookingTools', properties || {});
}

export interface BookingToolsProperties {
  tabNumber?: number;
}
