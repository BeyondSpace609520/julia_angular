import { ValidatorFn, Validators } from '@angular/forms';

import { HotelRegistrationRecord } from '@/app/main/window/content/customer-admin/guest-registration/models';

import { Providers } from '../../../../create-registration-form/consts';

const strValidators = [Validators.required];

export function getFieldValidators(
  fieldId: string,
  reportingClientProviderId: HotelRegistrationRecord['guestRegistrationProviderId'],
  desklineEditionV3: HotelRegistrationRecord['desklineEditionV3']
): ValidatorFn[] {
  switch (fieldId) {
    case 'mcNumber': // MCNummer
      return ([
        Providers.FERATEL,
        Providers.FERATELCH,
      ].includes(reportingClientProviderId) &&
        !desklineEditionV3) ||
      [ Providers.GEIOS,
        Providers.AVS
      ].includes(reportingClientProviderId)
        ? strValidators
        : [];
    case 'username': // Benutzer
    case 'password': // Password
      return [
        Providers.FERATEL,
        Providers.FERATELCH,
        Providers.AVS,
        Providers.WILKEN,
        Providers.CARDXPERTS,
        Providers.GEIOS,
      ].includes(reportingClientProviderId)
        ? strValidators
        : [];
    case 'communityNumber': // Gemeinde Nr
    case 'businessIndicator': // Betriebskennzeichen
      return [
        Providers.FERATEL,
        Providers.FERATELCH,
        Providers.AVS,
        Providers.CARDXPERTS,
      ].includes(reportingClientProviderId)
        ? strValidators
        : [];
    default:
      return [];
  }
}
