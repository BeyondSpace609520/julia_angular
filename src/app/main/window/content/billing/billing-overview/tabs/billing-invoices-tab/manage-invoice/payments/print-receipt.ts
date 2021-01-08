import { ApiClient } from '@/app/helpers/api-client';
import { PrintPrepaymentParameter } from '@/app/helpers/models';
import { redirectWithPOST } from '@/app/main/window/utils';
import { environment } from '@/environments/environment';
import { ModalService } from '@/ui-kit/services/modal.service';
import { PrintPaymentIframeComponent } from './print-payment-iframe/print-payment-iframe.component';

export async function printReceipt(
  itemId: number,
  prepaymentParameter: PrintPrepaymentParameter,
  apiClient: ApiClient,
  modalService: ModalService
): Promise<void> {
  const response = await apiClient.printPaymentConfirmation(prepaymentParameter, itemId).toPromise();

  if (response.isCashPayment === false || response.cashPaymentDefaultFormat !== 'manual') {
    redirectWithPOST(environment.remoteUrl + response.pdfFilename, {});
  } else {
    const modalData = modalService.openBorderless(PrintPaymentIframeComponent, {
      ngbOptions: {
        size: 'sm'
      }
    });

    modalData.modalBody.init(response);
    await modalData.modalBody.close.toPromise();
    modalData.modal.close(true);
  }
}
