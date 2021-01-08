import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { MergeGuestComponent } from './merge-guest.component';

export async function openMergeGuestModal(modalService: ModalService) {
    const modalData = modalService.openForms('BackEnd_WikiLanguage.CCA_MergeGuestsTitle', MergeGuestComponent, {
        primaryButtonLabel: 'BackEnd_WikiLanguage.CCA_MergeGuestsMergeButton',
        ngbOptions: {
          size: 'lg'
        }
    });
    await modalData.modalBody.init(valid => modalData.modal.formStatus = valid);

    return modalData;
}
