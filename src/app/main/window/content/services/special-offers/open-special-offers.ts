import { ViewService } from '@/app/main/view/view.service';

export function openSpecialOffers(viewService: ViewService): void {
  viewService.openViewById('specialOffers');
}
