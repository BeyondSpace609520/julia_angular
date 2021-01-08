import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { CopyToComponent } from './copy-to.component';

export interface CopyToModalOptions {
    title?: string;
}

export function openCopyToModal(modal: ModalService, onCancel?: () => void, options?: CopyToModalOptions) {
    const modalData = modal.openForms(options && options.title || 'BackEnd_WikiLanguage.generic_Copy', CopyToComponent, {
        ngbOptions: {
          size: 'xl'
        },
        cancelWithoutClosing: true
    });

    modalData.modal.save.subscribe(async () => {
        await modalData.modalBody.save();
        modalData.modal.close(true);
    });

    modalData.modal.cancel.subscribe(() => {
        if (onCancel) { onCancel(); }
        modalData.modal.close(true);
    });

    return modalData.modalBody;
}
