import { ViewService } from '@/app/main/view/view.service';

export function openVisitorsTaxSettings(viewService: ViewService): void {
  viewService.openViewById('visitorsTax');
}
