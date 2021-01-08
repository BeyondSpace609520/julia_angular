// import { ModalService } from 'easybooking-ui-kit/services/modal.service';

// import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { GuestDetail, GuestType } from '../guest-information/models';
import { RegFormBody, RegistrationTaxType } from './models';

type TranslateFunction = (text: string) => Promise<string>;

export async function validateRegFormLocally(
  body: RegFormBody,
  list: GuestDetail[],
  taxTypes: RegistrationTaxType[],
  translate: TranslateFunction
): Promise<string | null> {
  if (taxTypes.length > 0) {
    const guestsWithInvalidTaxTypes = list.filter(
      (g) => !g.taxTypeId || !+g.taxTypeId
    );

    if (guestsWithInvalidTaxTypes.length > 0) {
      const adults = guestsWithInvalidTaxTypes.filter(
        (g) => g.type === GuestType.ADULT
      );
      const children = guestsWithInvalidTaxTypes.filter(
        (g) => g.type === GuestType.CHILD
      );

      return `${await translate('BackEnd_WikiLanguage.MW_noTaxTypeAlert')}
          ${children.length ? `${await translate('BackEnd_WikiLanguage.MW_CopyToChild')} ${children.map(g => g.no).join(', ')}` : ''}
          ${adults.length && children.length ? ' + ' : ''}
          ${adults.length ? `${await translate('BackEnd_WikiLanguage.MW_CopyToAdult')} ${adults.map(g => g.no).join(', ')}` : ''}`;
    }
  }

  if (!body.fromDate) {
    return await translate('BackEnd_WikiLanguage.MW_InvalidArrivalWarning');
  }
  if (!body.plannedUntilDate) {
    return await translate(
      'BackEnd_WikiLanguage.MW_InvalidPlannedDepartureWarning'
    );
  }
  if (body.departed && !body.untilDate) {
    return await translate('BackEnd_WikiLanguage.MW_InvalidDepartureWarning');
  }
  return null;
}
