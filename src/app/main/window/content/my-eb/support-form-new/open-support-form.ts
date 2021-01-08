import { ViewService } from '@/app/main/view/view.service';

export function openSupportForm(viewService: ViewService, parameters?: SupportFormProperties): void {
  viewService.openViewWithProperties('iframedSupportFormNew', parameters || {});
}

export interface SupportFormProperties {
  caseId?: number;
}
