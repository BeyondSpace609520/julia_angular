import { ViewService } from '@/app/main/view/view.service';

export function openAddGuestPayments(viewService: ViewService, properties?: AddGuestPaymentsProperties): void {
  viewService.openViewWithProperties('iframeAddGuestPayments', properties || {});
}

export interface AddGuestPaymentsProperties {
  bookingNo?: string;
  openCashRegister?: boolean;
  amendmentMode?: boolean;
}
