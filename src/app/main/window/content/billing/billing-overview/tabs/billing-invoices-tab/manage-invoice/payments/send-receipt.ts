import { ModalService } from '@/ui-kit/services/modal.service';
import { Invoice, Payment } from '../models';
import { SendConfirmationComponent } from './send-confirmation/send-confirmation.component';

export async function sendReceipt(item: Payment, invoice: Invoice, modalService: ModalService): Promise<void> {
  const modalData = modalService.openForms('BackEnd_WikiLanguage.PrepaymentSenderTitle', SendConfirmationComponent, {
    primaryButtonLabel: 'BackEnd_WikiLanguage.PrepaymentSendButtonLabel',
    disableClose: true
  });

  modalData.modalBody.init(modalData.modal, item, invoice);
  await modalData.modalBody.saved.toPromise();
}
