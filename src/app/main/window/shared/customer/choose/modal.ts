import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { Customer } from '../models';
import { ChooseCustomerComponent } from './choose-customer.component';

// tslint:disable-next-line: max-line-length
export async function chooseCustomerModal(modalService: ModalService, initial: string, excludeCustomerId?: number): Promise<Customer | null> {
    const modalData = modalService.openForms('BackEnd_WikiLanguage.generic_Search', ChooseCustomerComponent, {
        ngbOptions: {
          size: 'lg'
        },
        disableClose: true,
        hidePrimaryButton: true,
        cancelWithoutClosing: true
    });

    return new Promise((res) => {
      modalData.modalBody.init(initial, excludeCustomerId, async customer => {
        res(customer);
        modalData.modal.close(true);
      });
      modalData.modal.cancel.subscribe(() => {
        res(null);
        modalData.modal.close(true);
      });
    });
}
