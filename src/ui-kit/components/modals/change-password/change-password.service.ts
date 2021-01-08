import { AuthService } from '@/app/auth/auth.service';
import { ChangePasswordButtonsComponent } from '@/ui-kit/components/modals/change-password/change-password-buttons/change-password-buttons.component';
import { ChangePasswordComponent } from '@/ui-kit/components/modals/change-password/change-password.component';
import { ModalService } from '@/ui-kit/services/modal.service';
import { Injectable, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService implements OnDestroy {

  constructor(
    private authService: AuthService,
    private modalService: ModalService,
  ) { }

  openModal(): void {
    const modal = this.modalService.openGeneric(
      'BackEnd_WikiLanguage.PW_Intro',
      ChangePasswordComponent,
      {
        disableClose: true,
        classes: ['password-change-modal'],
      },
      ChangePasswordButtonsComponent,
    );
    modal.modalBody.formValid$.pipe(untilDestroyed(this)).subscribe(valid => {
      modal.modalShortcuts.formValid = valid;
    });
    modal.modalShortcuts.submit.pipe(untilDestroyed(this)).subscribe(() => {
      modal.modalBody.onSubmit();
    });
    modal.modalShortcuts.cancel.pipe(untilDestroyed(this)).subscribe(() => {
      modal.modal.activeModal.close();
    });
  }

  ngOnDestroy(): void {}
}
