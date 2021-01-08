import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader.types';
import { ResendEmailComponent } from './modal/resend-email.component';

@Directive({
  selector: '[appResendEmail]',
  exportAs: 'resender'
})
export class ResendEmailDirective {

  @Input() appResendEmail: ResendEmailData;
  @Output() emailSend = new EventEmitter();

  private emailSentResponse: string | null = null;

  constructor(
    private modalService: ModalService,
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  @HostListener('click')
  async resendEmail(): Promise<void> {
    if (this.emailSentResponse !== null) { return; } // prevent resending
    const { email, billingId, targetId } = this.appResendEmail;

    const modalData = await this.modalService.openForms('Resend Email', ResendEmailComponent, {
      disableClose: true
    });

    modalData.modalBody.init(email, validStatus => {
      modalData.modal.formStatus = validStatus;
    });

    modalData.modal.save.subscribe(async () => {
      modalData.modal.formStatus = false;
      const result = await this.sendConfirmation(billingId, targetId, modalData.modalBody.getEmail());

      this.emailSentResponse = result[0];
      this.emailSend.emit(result[0]);
      modalData.modal.close(true);
    });
  }

  @Loading(LoaderType.RESEND_EMAIL)
  async sendConfirmation(billingId: number, targetId: number, email: string) {
    return await this.apiClient.sendInvoiceComments(billingId, targetId, email).toPromise();
  }

  public get tooltip() {
    switch (this.emailSentResponse) {
      case null: return 'BackEnd_WikiLanguage.CCAI_ResendInteraction';
      case 'Success': return 'BackEnd_WikiLanguage.EMA_SendTestEmailSuccess';
      default: return 'BackEnd_WikiLanguage.generic_cannotSendEmail';
    }
  }

  public get icon() {
    return {['mdi-' + this.iconName]: true };
  }

  public get iconName() {
    switch (this.emailSentResponse) {
      case null: return 'email';
      case 'Success': return 'check';
      default: return 'message-alert';
    }
  }
}

export interface ResendEmailData {
  billingId: number;
  targetId: number;
  email: string;
}
