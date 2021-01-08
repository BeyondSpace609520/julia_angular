import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { AnonymizationComponent } from './anonymization/anonymization.component';
import { ConfirmAnonymizationComponent } from './confirm-anonymization/confirm-anonymization.component';
import { CustomerConfirmParams } from './models';

@Component({
  selector: 'app-anonymize-customer',
  templateUrl: './anonymize.component.pug',
  styleUrls: ['./anonymize.component.sass']
})
export class AnonymizeComponent {

  @Input() customerId: number;
  @Input() email: string;
  @Output() update = new EventEmitter();

  constructor(private modalService: ModalService) {}

  async openAnonymize() {
    // https://trello.com/c/cfoYC4m2/31-customeradmin-screen-detail-tab-anonymize-button
    const modalData = this.modalService.openForms('BackEnd_WikiLanguage.anonymizationConfirmation', AnonymizationComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.cancellationInvoiceConfirmButton',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
      disableClose: true,
      inverseBackgroundColors: true,
      headerWithoutBorder: true,
    });

    modalData.modal.save.subscribe(async () => {
      modalData.modal.formStatus = false;
      const data = await modalData.modalBody.save(this.customerId);

      modalData.modal.close(true);
      this.update.emit(); // update all list according to requirements
      this.confirmAnonymize(data, this.email);
    });
  }

  async confirmAnonymize(params: CustomerConfirmParams, email: string) {
    // tslint:disable-next-line: max-line-length
    const modalData = this.modalService.openForms('BackEnd_WikiLanguage.anonymizationConfirmationMailHeader', ConfirmAnonymizationComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.PrepaymentSendButtonLabel',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_dontSend',
      disableClose: true
    });

    modalData.modalBody.init(email, valid => {
      modalData.modal.formStatus = valid;
    });

    modalData.modal.save.subscribe(async () => {
      modalData.modal.formStatus = false;
      await modalData.modalBody.save(params);
      modalData.modal.close(true);
    });
  }
}
