import { assignEnquiry, openEnquiry } from '@/app/main/window/content/channel-management/enquiry-pool/functions';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { ViewService } from '@/app/main/view/view.service';
import { focusRoomplan } from '@/app/main/window/content/calendar/calendar-html/focusRoomplan';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { MoveToRoomplanEvent, SendToRoomplanEvent,
  ShowRoomplanMessageEvent, StartLoadingAnimationRoomplanEvent } from '../../../calendar/calendar-html/events';
import { LoaderType } from '../loader-types';
import { Enquiry } from '../models';
import { RejectionModalComponent } from './rejection-modal/rejection-modal.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.pug',
  styleUrls: ['./actions.component.sass']
})
export class ActionsComponent {

  @Input() enquiry!: Enquiry;
  @Output() listChange = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private modalService: ModalService,
    private apiClient: ApiClient,
    private eventBus: EventBusService,
    private loaderService: LoaderService,
    private viewService: ViewService,
  ) { }

  get isOpen() {
    return this.enquiry.status === 'openEnquiry';
  }
  get isAirbnb() {
    return this.enquiry.isAirbnb;
  }

  get canView() {
    return !this.isAirbnb && (this.enquiry.status === 'manual' || this.enquiry.status === 'automatic');
  }

  async cancel() {
    if (this.enquiry.isAirbnb) {
      const modalData = this.modalService.openForms('BackEnd_WikiLanguage.epAirbnbDeclineReason', RejectionModalComponent, {
        primaryButtonLabel: 'general.send.text',
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
        disableClose: true
      });

      modalData.modalBody.init(valid => {
        modalData.modal.formStatus = valid;
      });

      modalData.modal.save.subscribe(async () => {
        if (await modalData.modalBody.onSend(this.enquiry)) {
          modalData.modal.close(true);
          this.listChange.emit();
        }
      });
    } else {
      const confirmed = await this.modalService.openConfirm('BackEnd_WikiLanguage.EQP_messageCancelEnquiry', '', {
        primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Yes',
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
        disableClose: true
      });

      if (confirmed) {
        await this.cancelConfirmed();
      }
    }
  }

  @Loading(LoaderType.ACTION)
  async cancelConfirmed() {
    await this.apiClient.cancelEnquiry(this.enquiry.raw).toPromise();
    this.listChange.emit();
  }

  async delete() {
    const confirmed = await this.modalService.openConfirm('BackEnd_WikiLanguage.EQP_messageDeleteEnquiry', '', {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Yes',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
      disableClose: true
    });

    if (confirmed) {
      await this.deleteConfirmed();
    }
  }

  @Loading(LoaderType.ACTION)
  async deleteConfirmed() {
    await this.apiClient.deleteEnquiry(this.enquiry.raw).toPromise();
    this.listChange.emit();
  }

  async assign() {
    if (this.enquiry.isAirbnb) {
      await this.assignAirBnb(this.enquiry.id);
    } else {
      assignEnquiry(this.enquiry, this.viewService, this.apiClient, this.eventBus, this.translate);
    }
  }

  @Loading(LoaderType.ACTION)
  async assignAirBnb(id: number) {
    await this.apiClient.sendEnquiryToAirbnb(id, false).toPromise();
  }

  async markAssign() {
    const confirmed = await this.modalService.openConfirm('BackEnd_WikiLanguage.EQP_messageManualCreatedEnquiry', '', {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Yes',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
      disableClose: true
    });

    if (confirmed) {
      await this.markConfirmed();
    }
  }

  @Loading(LoaderType.ACTION)
  async markConfirmed() {
    await this.apiClient.setEnquiryStatusToManual(this.enquiry.id).toPromise();
    this.listChange.emit();
  }

  async previewOffer(index: number) {
    openEnquiry(this.enquiry, index, this.viewService, this.eventBus);
  }
}
