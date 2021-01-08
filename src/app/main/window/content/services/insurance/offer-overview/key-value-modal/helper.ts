import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { InsuranceType, KeyValueModalComponent } from './key-value-modal.component';

export function openKeyValueModal(id: number, type: InsuranceType, modalService: ModalService) {
    const modalData = modalService.openForms('', KeyValueModalComponent, {
        primaryButtonLabel: 'general.send.text',
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
        hideHeader: true,
        hidePrimaryButton: true,
        ngbOptions: {
            size: 'lg',
        },
    });

    modalData.modalBody.load(id, type);
}
