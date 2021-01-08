import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent implements OnInit, OnDestroy {
  @Input() closable = false;
  @Input() textHead: string;
  @Input() textBody: string;
  @Input() textBodyIsHTML: boolean;
  @Input() modalType = 1;
  @Input() autoConfirm: number;
  @Input() buttonOkLabel = 'general.buttonYes.text';
  @Input() buttonCancelLabel = 'general.buttonNo.text';
  @Input() hideSecondaryButton = false;
  @Input() primaryButtonColor: string;

  private autoConfirmTimer: number;

  constructor(public activeModal: NgbActiveModal) { }

  private setupAutoConfirmTimer(): void {
    if (this.autoConfirm === undefined || this.autoConfirm <= 0) {
      return;
    }
    this.autoConfirmTimer = setInterval(() => {
      this.autoConfirm--;
      if (this.autoConfirm === 0) {
        this.activeModal.close(true);
      }
    }, 1000);
  }

  ngOnInit(): void {
    this.setupAutoConfirmTimer();
  }

  ngOnDestroy(): void {
    if (this.autoConfirmTimer) {
      clearInterval(this.autoConfirmTimer);
    }
  }
}
