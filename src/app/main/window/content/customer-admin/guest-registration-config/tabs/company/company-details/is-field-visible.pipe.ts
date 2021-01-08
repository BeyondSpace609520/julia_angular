import { Pipe, PipeTransform } from '@angular/core';

import { Providers } from '../../../../create-registration-form/consts';
import { HotelRegistrationRecord } from '../../../../guest-registration/models';

@Pipe({
  name: 'isFieldVisible'
})
export class IsFieldVisiblePipe implements PipeTransform {
  transform(
    fieldId: string,
    reportingClientProviderId: HotelRegistrationRecord['guestRegistrationProviderId'],
    desklineEditionV3: HotelRegistrationRecord['desklineEditionV3']
  ): boolean {
    return isFieldVisible(fieldId, reportingClientProviderId, desklineEditionV3);
  }
}

export function isFieldVisible(
  fieldId: string,
  reportingClientProviderId: HotelRegistrationRecord['guestRegistrationProviderId'],
  desklineEditionV3: HotelRegistrationRecord['desklineEditionV3']
): boolean {
  switch (fieldId) {
    case 'advanceBookingPossible': // Voranmeldung möglich
      return [
        Providers.FERATEL,
        Providers.FERATELCH,
        Providers.CARDXPERTS
      ].includes(
        reportingClientProviderId
      );
    case 'desklineEditionV3': // V3.0
    case 'emailToFeratel': // Füge Gast E-Mail hinzu
      return [Providers.FERATEL, Providers.FERATELCH].includes(
        reportingClientProviderId
      );
    case 'alternativeProviderLink': // alternativer link
    case 'guestCardSeparate': // Gästekartendruck Papier
      return [
        Providers.FERATEL,
        Providers.THALER,
        Providers.CAPCORN,
      ].includes(reportingClientProviderId);
    case 'mcNumber': // MCNummer
      return (
        (reportingClientProviderId !== Providers.FERATEL ||
          !desklineEditionV3) &&
        (reportingClientProviderId !== Providers.FERATELCH ||
          !desklineEditionV3) &&
        ![Providers.WILKEN, Providers.CARDXPERTS].includes(
          reportingClientProviderId
        )
      );
    case 'clientCode': // Mandanten Code
      return (
        (reportingClientProviderId !== Providers.FERATEL ||
          !desklineEditionV3) &&
        (reportingClientProviderId !== Providers.FERATELCH ||
          !desklineEditionV3) &&
        ![
          Providers.AVS,
          Providers.WILKEN,
          Providers.GEIOS,
        ].includes(reportingClientProviderId)
      );
    case 'code':
      return (
        (reportingClientProviderId !== Providers.FERATEL ||
          !desklineEditionV3) &&
        (reportingClientProviderId !== Providers.FERATELCH ||
          !desklineEditionV3) &&
        ![
          Providers.AVS,
          Providers.WILKEN,
          Providers.CARDXPERTS,
          Providers.GEIOS,
        ].includes(reportingClientProviderId)
      );
    case 'username': // Benutzer
    case 'password': // Password
      return ![Providers.AVS, Providers.CAPCORN].includes(
        reportingClientProviderId
      );
    case 'communityNumber': // Gemeinde Nr
      return ![Providers.WILKEN, Providers.CAPCORN, Providers.GEIOS].includes(
        reportingClientProviderId
      );
    case 'businessIndicator': // Betriebskennzeichen
      return ![Providers.WILKEN, Providers.CAPCORN].includes(
        reportingClientProviderId
      );
    case 'name': // hotelname
    case 'guestRegistrationProviderId': // meldeclient provider
      return true;
    default:
      return false;
  }
}
