import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { InsertModalBodyComponent } from './body/body.component';
import { OnInsertFunction } from './types';

export interface InsertModalOptions {
  primaryButtonLabel?: string;
  value?: string;
}

// tslint:disable-next-line: max-line-length
export async function openInsertModal(modalService: ModalService, title: string, label: string, onInsert: OnInsertFunction, options?: InsertModalOptions) {
    const modalData = modalService.openForms(title, InsertModalBodyComponent, {
      primaryButtonLabel: options && options.primaryButtonLabel || 'BackEnd_WikiLanguage.generic_Insert',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
      disableClose: true
    });

    modalData.modalBody.init(label, options && options.value || '', onInsert, valid => {
      modalData.modal.formStatus = valid;
    });

    modalData.modal.save.subscribe(async () => {
      if (await modalData.modalBody.onSave()) {
        modalData.modal.close(true);
      }
    });
}
