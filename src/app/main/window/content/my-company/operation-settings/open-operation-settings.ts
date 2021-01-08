import { ViewService } from '@/app/main/view/view.service';

export function openOperationSettings(viewService: ViewService, properties?: OperationSettingsProperties ): void {
  viewService.openViewWithProperties('hotelManagement', properties || {});
}

export interface OperationSettingsProperties {
  tab?: string;
}
