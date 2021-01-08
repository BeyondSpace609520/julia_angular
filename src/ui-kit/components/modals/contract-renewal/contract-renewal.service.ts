import { ApiSupportFormService } from '@/app/helpers/api/api-support-form.service';
import { ModalGenericComponent } from '@/ui-kit/components/modal-generic/modal-generic.component';
import { ContractRenewalButtonsComponent } from '@/ui-kit/components/modals/contract-renewal/contract-renewal-buttons/contract-renewal-buttons.component';
import { ContractRenewalComponent } from '@/ui-kit/components/modals/contract-renewal/contract-renewal.component';
import { ModalService } from '@/ui-kit/services/modal.service';
import { Injectable, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

const remindMeLaterTimeout = 1800;

@Injectable({
  providedIn: 'root'
})
export class ContractRenewalService implements OnDestroy {

  constructor(
    private modalService: ModalService,
    private apiSupportFormService: ApiSupportFormService
  ) {}

  async openContactRenewal(): Promise<{
    modal: ModalGenericComponent,
    modalBody: ContractRenewalComponent,
    modalShortcuts: ContractRenewalButtonsComponent,
    result: Promise<boolean>
  }> {
    const data = await this.apiSupportFormService.getContractRenewalData().toPromise();
    const modal = this.modalService.openGeneric<ContractRenewalComponent, ContractRenewalButtonsComponent>(
      'BackEnd_WikiLanguage.sugarContractRenewalScreenTitle',
      ContractRenewalComponent,
      {
        disableClose: true,
        classes: ['contract-renewal-modal'],
      },
      ContractRenewalButtonsComponent
    );
    modal.modalBody.formStateChange.pipe(untilDestroyed(this)).subscribe(formState => {
      modal.modalShortcuts.formState = formState;
    });
    modal.modalBody.init(data);
    modal.modalBody.close.pipe(untilDestroyed(this)).subscribe(() => {
      modal.modal.activeModal.close();
    });
    modal.modalBody.remindMeLater.pipe(untilDestroyed(this)).subscribe(() => {
      setTimeout(() => this.openContactRenewal(), remindMeLaterTimeout*1000);
      modal.modal.activeModal.close();
    });
    modal.modalShortcuts.buttonPress.pipe(untilDestroyed(this)).subscribe(buttonType => {
      modal.modalBody.onButtonClick(buttonType);
    });
    return modal;
  }

  ngOnDestroy(): void {}
}
