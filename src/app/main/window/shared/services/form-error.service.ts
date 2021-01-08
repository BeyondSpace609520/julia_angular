import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ApiClient } from '@/app/helpers/api-client';
import { ModalService } from '@/ui-kit/services/modal.service';
import { RegFormBody } from '../../content/customer-admin/create-registration-form/models';

@Injectable({
  providedIn: 'root'
})
export class FormErrorService {
  constructor(
    private apiClient: ApiClient,
    private modalService: ModalService,
    private translate: TranslateService,
  ) { }

  public async showDepartedError(
    errorCode: string,
    errorText: string,
    registrationFormId: RegFormBody['id'] | null,
    canForceDeparture: boolean
  ): Promise<boolean> {
    const titleKey = 'BackEnd_WikiLanguage.MW_ErrorSendingToFeratel1';
    const messageErrorCode = await this.translate.get('BackEnd_WikiLanguage.MW_ErrorSendingToFeratel2').toPromise();
    const canMove = (['15', '52', '53', '99.3', '141', '4'].includes(errorCode)) && canForceDeparture;
    const message = `${messageErrorCode} ${errorCode}<br>${errorText}`;

    if (canMove) {
      const messageManualMove = await this.translate.get('BackEnd_WikiLanguage.labelMoveRegformManuallyToDeparted').toPromise();
      const needMove = await this.modalService.openConfirm(titleKey, `${message}<br><br>${messageManualMove}`, {
        primaryButtonLabel: 'BackEnd_WikiLanguage.generic_move',
        textBodyIsHTML: true
      });
      if (needMove) {
        await this.apiClient.forceSetDeparture(registrationFormId).toPromise();
        return true;
      }
    } else {
      this.modalService.openSimpleText(
        titleKey,
        message,
        {
          ngbOptions: { size: 'sm' },
          textBodyIsHTML: true
        }
      );
    }
    return false;
  }
}
