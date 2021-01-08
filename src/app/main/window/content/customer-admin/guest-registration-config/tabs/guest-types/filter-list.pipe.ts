import { Pipe, PipeTransform } from '@angular/core';

import { RegistrationTaxType } from '@/app/main/window/content/customer-admin/create-registration-form/models';
import { ReportingClientProvider } from '../../models';

@Pipe({
  name: 'filterList'
})
export class FilterListPipe implements PipeTransform {

  transform(
    guestTypes: RegistrationTaxType[],
    providerId: ReportingClientProvider['id'] | null,
    selected: boolean
  ): RegistrationTaxType[] {
    if (!guestTypes) {
      return [];
    }
    return guestTypes.filter(guestType =>
      (providerId === null || guestType.guestRegistrationProviderId === providerId)
      && guestType.usedByHotel === selected
      && guestType.name !== ''
    );
  }

}
