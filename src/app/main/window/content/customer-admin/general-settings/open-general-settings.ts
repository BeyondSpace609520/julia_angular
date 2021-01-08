import { ViewService } from '@/app/main/view/view.service';

export function openGeneralSettings(viewService: ViewService, parameters?: GeneralSettingsParameters): void {
  viewService.openViewWithProperties('generalSettings', parameters || {});
}

export interface GeneralSettingsParameters {
  preselectTabId?: string;
}
