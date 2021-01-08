import { ModalProgressComponent } from '@/ui-kit/components/modal-progress/modal-progress.component';
import { Injectable, OnDestroy, Type } from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import {cloneObject, extendObject} from '../utils/static.functions';
import {ModalSimpleTextComponent} from '../components/modal-simple-text/modal-simple-text.component';
import {ModalConfirmComponent} from '../components/modal-confirm/modal-confirm.component';
import {ModalFormsComponent} from '../components/modal-forms/modal-forms.component';
import {ModalGenericComponent} from '../components/modal-generic/modal-generic.component';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {ModalBorderlessComponent} from '../components/modal-borderless/modal-borderless.component';

const defaultOptions: ModalOptions = {
  skipJulia: true,
  disableClose: false,
  scrollable: false,
  ngbOptions: {}
};

@Injectable()
export class ModalService implements OnDestroy {
  constructor(private ngModalService: NgbModal) { }

  openSimpleText(textHead: string, textBody?: string, options?: ModalOptions, textBodyTitle?: string): {modal: NgbModalRef, result: Promise<string>}  {
    options = extendObject(cloneObject(defaultOptions), options) as ModalOptions;
    const ngbOptions = this.getNgbOptions(options);
    const modalRef = this.ngModalService.open(ModalSimpleTextComponent, ngbOptions);
    modalRef.componentInstance.textHead = textHead;
    modalRef.componentInstance.textBody = textBody || '';
    modalRef.componentInstance.textBodyIsHTML = options.textBodyIsHTML || false;
    modalRef.componentInstance.textBodyTitle = textBodyTitle || '';
    if (options.modalType) {
      modalRef.componentInstance.modalType = options.modalType;
    }
    if (options.closeLabel) {
      modalRef.componentInstance.buttonCloseLabel = options.closeLabel;
    }
    if (options.loadingAnimation) {
      modalRef.componentInstance.loadingAnimation = options.loadingAnimation;
    }
    modalRef.componentInstance.closable = !options.disableClose;
    return {
      modal: modalRef,
      result: modalRef.result
    };
  }

  openGeneric<T1, T2>(textHead: string, body: Type<T1>, options?: ModalOptions, shortcuts?: Type<T2>): {modal: ModalGenericComponent, modalBody: T1, modalShortcuts: T2, result: Promise<boolean>} {
    options = extendObject(cloneObject(defaultOptions), options) as ModalOptions;
    const ngbOptions = this.getNgbOptions(options);
    const modalRef = this.ngModalService.open(ModalGenericComponent, ngbOptions);
    modalRef.componentInstance.textHead = textHead;
    const modalBody = modalRef.componentInstance.setBody(body);
    let modalShortcuts: any = null;
    if  (shortcuts) {
      modalShortcuts = modalRef.componentInstance.setShortcuts(shortcuts);
    }
    if (options.closeLabel) {
      modalRef.componentInstance.buttonCloseLabel = options.closeLabel;
    }
    if (options.primaryButtonColor) {
      modalRef.componentInstance.buttonClass = options.primaryButtonColor;
    }
    if (options.hideHeader) {
      modalRef.componentInstance.hideHeader = true;
    }
    modalRef.componentInstance.closable = !options.disableClose;
    modalRef.componentInstance.closableWithIcon = !options.disableCloseIcon;
    return {
      modal: modalRef.componentInstance,
      modalBody,
      modalShortcuts,
      result: modalRef.result
    };
  }

  openBorderless<T>(body: Type<T>, options?: ModalOptions): {modal: ModalBorderlessComponent, modalBody: T} {
    options = extendObject(cloneObject(defaultOptions), options) as ModalOptions;

    const ngbOptions = this.getNgbOptions(options);
    const modalRef = this.ngModalService.open(ModalBorderlessComponent, ngbOptions);
    const modalBody = modalRef.componentInstance.setBody(body);

    return {
      modal: modalRef.componentInstance,
      modalBody
    };
  }

  openConfirm(textHead: string, textBody?: string, options?: ModalOptions): Promise<boolean> {
    options = extendObject(cloneObject(defaultOptions), options) as ModalOptions;
    const ngbOptions = this.getNgbOptions(options);
    const modalRef = this.ngModalService.open(ModalConfirmComponent, ngbOptions);
    modalRef.componentInstance.textHead = textHead;
    modalRef.componentInstance.textBody = textBody || '';
    modalRef.componentInstance.textBodyIsHTML = options.textBodyIsHTML || false;
    if (options.modalType) {
      modalRef.componentInstance.modalType = options.modalType;
    }
    if (options.closeLabel) {
      modalRef.componentInstance.buttonCancelLabel = options.closeLabel;
    }
    if (options.primaryButtonLabel) {
      modalRef.componentInstance.buttonOkLabel = options.primaryButtonLabel;
    }
    if (options.secondaryButtonLabel) {
      modalRef.componentInstance.buttonCancelLabel = options.secondaryButtonLabel;
    }
    if (options.primaryButtonColor) {
      modalRef.componentInstance.primaryButtonColor = options.primaryButtonColor;
    }
    if (options.hideSecondaryButton) {
      // console.log(options.hideSecondaryButton);
      modalRef.componentInstance.hideSecondaryButton = options.hideSecondaryButton;
    }
    if (options.autoConfirmTimeout) {
      modalRef.componentInstance.autoConfirm = options.autoConfirmTimeout;
    }
    modalRef.componentInstance.closable = !options.disableClose;
    return modalRef.result;
  }

  openForms<T>(textHead: string, body: Type<T>, options?: ModalOptions): {modal: ModalFormsComponent, modalBody: T, result: Promise<boolean>} {
    options = extendObject(cloneObject(defaultOptions), options) as ModalOptions;
    let primaryButtonColor = 'btn-secondary';
    const ngbOptions = this.getNgbOptions(options);
    const modalRef = this.ngModalService.open(ModalFormsComponent, ngbOptions);
    modalRef.componentInstance.textHead = textHead;
    const modalBody = modalRef.componentInstance.setBody(body);
    if (options.modalType) {
      modalRef.componentInstance.modalType = options.modalType;
      if (!options.primaryButtonColor) {
        primaryButtonColor = (options.modalType === 2) ? 'btn-success' : 'btn-secondary';
      }
    }
    if (options.academyScreenId) {
      modalRef.componentInstance.academyScreenId = options.academyScreenId;
    }
    if (options.primaryButtonColor) {
      primaryButtonColor = options.primaryButtonColor;
    }
    modalRef.componentInstance.primaryButtonColor = primaryButtonColor;
    if (options.cancelWithoutClosing) {
      modalRef.componentInstance.cancelWithoutClosing = options.cancelWithoutClosing;
    }
    if (options.cancelIconWithoutClosing) {
      modalRef.componentInstance.cancelIconWithoutClosing = options.cancelIconWithoutClosing;
    }
    if (options.primaryButtonColor) {
      primaryButtonColor = options.primaryButtonColor;
    }
    modalRef.componentInstance.primaryButtonColor = primaryButtonColor;
    if (options.textHeadParams) {
      modalRef.componentInstance.textHeadParams = options.textHeadParams;
    }
    if (options.cancelWithoutClosing) {
      modalRef.componentInstance.cancelWithoutClosing = options.cancelWithoutClosing;
    }
    if (options.headerWithoutBorder) {
      modalRef.componentInstance.headerWithoutBorder = options.headerWithoutBorder;
    }
    if (options.inverseBackgroundColors) {
      modalRef.componentInstance.inverseBackgroundColors = options.inverseBackgroundColors;
    }
    if (options.fullWidthModalBody) {
      modalRef.componentInstance.fullWidthModalBody = options.fullWidthModalBody;
    }
    if (options.whiteModalBody) {
      modalRef.componentInstance.whiteModalBody = options.whiteModalBody;
    }
    if (options.modalBodyTopBorder) {
      modalRef.componentInstance.modalBodyTopBorder = options.modalBodyTopBorder;
    }
    if (options.closeLabel) {
      modalRef.componentInstance.buttonCancelLabel = options.closeLabel;
    }
    if (options.primaryButtonLabel) {
      modalRef.componentInstance.buttonSaveLabel = options.primaryButtonLabel;
    }
    if (options.primaryButtonIcon) {
      modalRef.componentInstance.buttonSaveIcon = options.primaryButtonIcon;
    }
    if (options.primaryButtonIconPosition) {
      modalRef.componentInstance.primaryButtonIconPosition = options.primaryButtonIconPosition;
    }
    if (options.hidePrimaryButton) {
      modalRef.componentInstance.hidePrimaryButton = options.hidePrimaryButton;
    }
    if (options.hideHeader) {
      modalRef.componentInstance.hideHeader = options.hideHeader;
    }
    if (options.extraButtonIcon) {
      modalRef.componentInstance.extraButtonIcon = options.extraButtonIcon;
    }
    if (options.extraButtonIconPosition) {
      modalRef.componentInstance.extraButtonIconPosition = options.extraButtonIconPosition;
    }
    if (options.primaryButtonColor) {
      modalRef.componentInstance.primaryButtonColor = options.primaryButtonColor;
    }
    if (options.secondaryButtonLabel) {
      modalRef.componentInstance.buttonCancelLabel = options.secondaryButtonLabel;
    }
    if (options.extraButton) {
      modalRef.componentInstance.extraButton = true;
    }
    if (options.extraButtonLabel) {
      modalRef.componentInstance.extraButtonLabel = options.extraButtonLabel;
    }
    if (options.extraButtonColor) {
      modalRef.componentInstance.extraButtonColor = options.extraButtonColor;
    }
    if (options.savePopOverTitle) {
      modalRef.componentInstance.savePopOverTitle = options.savePopOverTitle;
    }
    if (options.checkboxForPrimaryButton) {
      modalRef.componentInstance.checkboxForPrimaryButton = options.checkboxForPrimaryButton;
    }
    if (options.checkboxForPrimaryButtonLabel) {
      modalRef.componentInstance.checkboxForPrimaryButtonLabel = options.checkboxForPrimaryButtonLabel;
    }
    modalRef.componentInstance.closable = !options.disableClose;
    return {
      modal: modalRef.componentInstance,
      modalBody,
      result: modalRef.result
    };
  }

  openProgress(textHead: string, progress: Observable<number>, headStart?: boolean): void {
    const options: ModalOptions = extendObject(cloneObject(defaultOptions), {disableClose: true, size: 'sm'}) as ModalOptions;
    const ngbOptions = this.getNgbOptions(options);
    const modalRef = this.ngModalService.open(ModalProgressComponent, ngbOptions);
    const modalBody: ModalProgressComponent = modalRef.componentInstance;
    modalBody.textHead = textHead;
    modalBody.progress = progress;
    modalBody.headStart = headStart;
    progress.pipe(
      untilDestroyed(this)
    ).subscribe(
      progressValue => {},
      error => {},
      () => modalRef.close()
    );
  }

  private getNgbOptions(options: ModalOptions): NgbModalOptions {
    const classes: string[] = options.classes ? options.classes : [];
    let ngbOptions: NgbModalOptions = {};
    if (!options.skipJulia) {
      classes.push('julia');
    }
    if (options.disableClose) {
      ngbOptions.keyboard = false;
      ngbOptions.backdrop = 'static';
    }
    if (options.scrollable) {
      classes.push('scrollable');
    }
    ngbOptions.windowClass = classes.join(' ');
    if (options.ngbOptions) {
      ngbOptions = extendObject(ngbOptions, (options.ngbOptions));
    }
    return ngbOptions;
  }

  ngOnDestroy(): void {}
}

export interface ModalOptions {
  cancelWithoutClosing?: boolean;
  cancelIconWithoutClosing?: boolean;
  disableClose?: boolean;
  disableCloseIcon?: boolean;
  scrollable?: boolean;
  skipJulia?: boolean;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  extraButton?: boolean;
  extraButtonLabel?: string;
  extraButtonColor?: 'btn-success' | 'btn-primary' | 'btn-secondary' | 'btn-warning' | 'btn-danger';
  extraButtonIcon?: string;
  extraButtonIconPosition?: string;
  closeLabel?: string;
  savePopOverTitle?: string;
  modalType?: number;
  academyScreenId?: string;
  ngbOptions?: NgbModalOptions;
  classes?: string[];
  primaryButtonIcon?: string;
  primaryButtonIconPosition?: string;
  primaryButtonColor?: 'btn-success' | 'btn-primary' | 'btn-secondary' | 'btn-warning' | 'btn-danger';
  hidePrimaryButton?: boolean;
  hideSecondaryButton?: boolean;
  inverseBackgroundColors?: boolean;
  fullWidthModalBody?: boolean;
  whiteModalBody?: boolean;
  modalBodyTopBorder?: boolean;
  size?: string;
  textHeadParams?: { [k: string]: string };
  hideHeader?: boolean;
  headerWithoutBorder?: boolean;
  loadingAnimation?: boolean;
  autoConfirmTimeout?: number;
  textBodyIsHTML?: boolean;
  checkboxForPrimaryButton?: boolean;
  checkboxForPrimaryButtonLabel?: string;
}
