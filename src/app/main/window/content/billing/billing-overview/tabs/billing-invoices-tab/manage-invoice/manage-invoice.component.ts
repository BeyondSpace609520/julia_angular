import { Customer } from '@/app/main/window/shared/customer/models';
import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';

import { ModalFormsComponent } from 'easybooking-ui-kit/components/modal-forms/modal-forms.component';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ManageInvoiceService } from '../manage-invoice.service';
import { BillingInvoice } from '../models';
import { FormComponent } from './form/form.component';
import { LoaderType } from './loader-types';
import { Invoice, Payment, VersionDetail } from './models';
import { InvoiceIdentifier } from './models';
import { SavePaymentModalComponent } from './payments/save-payment-modal/save-payment-modal.component';
import { reduceInvoice } from './reduce';

@Component({
  selector: 'app-manage-invoice',
  templateUrl: './manage-invoice.component.pug',
  styleUrls: ['./manage-invoice.component.sass'],
  providers: [
    ManageInvoiceService
  ]
})
export class ManageInvoiceComponent implements OnDestroy {

  public invoice: Invoice | null = null;
  public modal: ModalFormsComponent;
  public target: InvoiceIdentifier | null = null;
  public billing: BillingInvoice | null = null;
  public totalPayments: number | null;
  public saved: boolean;

  public isLoading: Observable<boolean>;
  public hidePrimaryButton = new EventEmitter<boolean>();

  @ViewChild('form', { static: true }) form: FormComponent;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private invoiceService: ManageInvoiceService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MANAGE_INVOICE);
  }

  async init(target: null | InvoiceIdentifier, billing: null | BillingInvoice, forceEdit: boolean, modal: ModalFormsComponent, saved: boolean) {
    this.modal = modal;
    this.invoiceService.forceEdit = forceEdit;
    this.target = target;
    this.billing = billing;
    this.invoice = target ? await this.loadInvoice(target) : null;
    if (this.invoice) {
      this.hidePrimaryButton.emit(this.invoice.existingBillNo);
    }
    this.totalPayments = getTotalPayments(this.invoice);
    this.saved = saved;

    modal.save.subscribe(async () => {
      await this.form.save();
      await this.refreshInvoice();
      this.saved = true;
    });
  }

  public onChange(valid): void {
    this.modal.formStatus = valid;
  }

  @Loading(LoaderType.MANAGE_INVOICE)
  public async loadInvoice(target: InvoiceIdentifier): Promise<Invoice> {
    return reduceInvoice(await this.apiClient.getBillVersionDetail(true, target.billId, target.bookingId).toPromise());
  }

  public async refreshInvoice(keepFormInputs?: boolean): Promise<void> {
    if (!this.target) { return console.warn('InvoiceIdentifier not specified'); }
    const invoice: Invoice = await this.loadInvoice(this.target);
    if (this.invoice && keepFormInputs) {
      this.invoice.details = invoice.details;
      this.invoice.payments = invoice.payments;
      this.invoice.existingBillNo = invoice.existingBillNo;
      this.invoice.billSplitId = invoice.billSplitId;
      this.invoice.source = invoice.source;
      this.invoice.cancelled = invoice.cancelled;
      this.invoice.totalGross = invoice.totalGross;
      this.invoice.bookingId = invoice.bookingId;
      this.invoice.billingId = invoice.billingId;
      this.invoice.billingVersionId = invoice.billingVersionId;
    } else {
      this.invoice = invoice;
    }
    if (this.invoice) {
      this.hidePrimaryButton.emit(this.invoice.existingBillNo);
    }
    this.totalPayments = getTotalPayments(this.invoice);
  }

  public async addPayment(): Promise<void> {
    if (!this.invoice) { throw new Error('Invoice required'); }

    const modalData = this.modalService.openForms('BackEnd_WikiLanguage.BW_BillVersionPayment', SavePaymentModalComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Save',
      disableClose: true
    });

    modalData.modalBody.init(this.invoice, modalData.modal);
    modalData.modalBody.saved.subscribe(() => this.refreshInvoice(true));
    this.saved = true;
  }

  ngOnDestroy() {}
}

function getTotalPayments(invoice: Invoice | null): number | null {
  if (!invoice) {
    return null;
  }
  return invoice.payments.reduce((acc, p) => acc + p.amount, 0);
}
