import { TranslateService } from '@ngx-translate/core';

import { ViewService } from '@/app/main/view/view.service';
import { GuestRegistrationForm, HotelRegistrationRecord, ViewMode } from '../models';

export function openRegForm(
  viewService: ViewService,
  hotel: HotelRegistrationRecord,
  bookingId: GuestRegistrationForm['bookingId'],
  registrationFormId?: GuestRegistrationForm['id']
) {
  viewService.focusViewWithProperties(
    'createRegistrationForm',
    {
      hotel,
      bookingId,
      registrationFormId
    }
  );
}

export async function getExportedFileName(mode: ViewMode, translate: TranslateService): Promise<string> {
  return translate.get(getExportedFileNameKey(mode)).toPromise();
}

function getExportedFileNameKey(mode: ViewMode) {
  switch (mode) {
    case ViewMode.OVERVIEW:
      return 'BackEnd_WikiLanguage.MW_OverviewTAB';
    case ViewMode.ARRIVED:
      return 'BackEnd_WikiLanguage.MW_ArrivedTAB';
    case ViewMode.DEPARTED:
      return 'BackEnd_WikiLanguage.MW_DeparturedTAB';
    case ViewMode.IN_PREPARATION:
      return 'BackEnd_WikiLanguage.MW_PrepareTAB';
  }
}
