import { Pipe, PipeTransform } from '@angular/core';

import { RegistrationTaxType } from '@/app/main/window/content/customer-admin/create-registration-form/models';
import { ReportingClientProvider } from '../../models';

@Pipe({
  name: 'disableControl'
})
export class DisableControlPipe implements PipeTransform {

  transform(
    controlType: 'add' | 'remove',
    guestTypes: RegistrationTaxType[],
    selectedGuestTypeId: RegistrationTaxType['globalId'],
    providers: ReportingClientProvider[],
    providerId: ReportingClientProvider['id']
  ): boolean {
    if (!guestTypes || !selectedGuestTypeId || !providers || !providerId) {
      return true;
    }
    const provider = providers.find(p => p.id === providerId);
    if (!provider) {
      return true;
    }
    if (provider.taxTypesAreSynced) {
      return true;
    }
    const selectedGuestType = guestTypes.find(guestType => guestType.globalId === selectedGuestTypeId);
    if (!selectedGuestType) {
      return true;
    }
    switch (controlType) {
      case 'add':
        return selectedGuestType.usedByHotel;
      case 'remove':
        return !selectedGuestType.usedByHotel;
    }
    return false;
  }

}
