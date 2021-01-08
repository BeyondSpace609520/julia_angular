import { ViewService } from '@/app/main/view/view.service';

export function openReportAndList(viewService: ViewService, properties?: ReportAndListProperties) {
  viewService.openViewWithProperties('iframeReports', properties || {});
}

export interface ReportAndListProperties {
  jumpToPrepayments?: boolean;
}
