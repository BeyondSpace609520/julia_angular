import { ViewService } from '@/app/main/view/view.service';
import { ViewMode } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { DateRange } from '@/ui-kit/models';

export function openGuestRegistration(viewService: ViewService, properties?: GuestRegistrationProperties) {
  viewService.openViewWithProperties('guestRegistration', properties || {});
}

export interface GuestRegistrationProperties {
  activeTabId?: ViewMode;
  range?: DateRange;
  lastName?: string;
  status?: string;
}
