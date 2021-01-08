import { ViewService } from '@/app/main/view/view.service';
import { EnquiryPoolTabId } from '@/app/main/window/content/channel-management/enquiry-pool/models';

export function openEnquiryPool(viewService: ViewService, properties: EnquiryPoolParameters): void {
  viewService.openViewWithProperties('enquiryPool', properties || {});
}

export interface EnquiryPoolParameters {
  activeTabId?: EnquiryPoolTabId;
  fromDate?: Date;
  untilDate?: Date;
}
