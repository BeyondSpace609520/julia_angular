import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ModalFormsComponent } from 'easybooking-ui-kit/components/modal-forms/modal-forms.component';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormPaymentOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { Invoice, Payment } from '../../models';
import { inverseReducePayment } from '../../reduce';

@Component({
  selector: 'app-save-payment-modal',
  templateUrl: './save-payment-modal.component.pug',
  styleUrls: ['./save-payment-modal.component.sass']
})
export class SavePaymentModalComponent implements OnInit, OnDestroy {

  saved = new EventEmitter<void>();
  creditCardIsAvailable = false;
  form: FormGroup;
  isLoading: Observable<boolean>;
  types: FormPaymentOption[] = [];

  private payment?: Payment;
  private invoice: Invoice;

  constructor(
    private formData: FormDataService,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.SAVE_PAYMENT);
  }

  // TODO replace getter function to pipe
  private setCreditCardAvailability(currentValue: string) {
    const type = this.types.find(typeOption => typeOption.value === currentValue);
    this.creditCardIsAvailable = type ? type.isCreditCard : false;
  }

  public init(invoice: Invoice, modal: ModalFormsComponent, payment?: Payment): void {
    this.invoice = invoice;
    this.payment = payment;
    this.form = createForm(payment);
    const typeControl = this.form.get('type') as FormControl;
    typeControl.valueChanges.pipe(untilDestroyed(this)).subscribe((newValue) => {
      this.setCreditCardAvailability(newValue);
    });
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => { // TODO make reusable
      modal.formStatus = this.form.valid;
    });
    this.setCreditCardAvailability(typeControl.value);

    modal.save.subscribe(async () => {
      await this.savePayment();
      modal.close(true);
    });
  }

  @Loading(LoaderType.SAVE_PAYMENT)
  private async savePayment(): Promise<void> {
    const { amount, date, description, now, type } = this.form.getRawValue();

    const paymentObj = inverseReducePayment({
      ...(this.payment || {
          rcId: null,
          isCashPayment: false,
          name: null,
          isBookingPrepayment: false
      }),
      id: this.payment ? this.payment.id : null,
      amount,
      date,
      desc: description,
      typeId: type,
      isLocalPayment: this.creditCardIsAvailable && now,
      versionId: this.invoice.billingVersionId,
    });
    await this.apiClient.saveInvoicePayment(paymentObj).toPromise();
    this.saved.emit();
  }

  @Loading(LoaderType.SAVE_PAYMENT)
  async ngOnInit(): Promise<void> {
    this.types = await this.formData.getPaymentTypes();
  }

  ngOnDestroy(): void {}
}

function createForm(payment?: Payment) {
  return new FormGroup({
    type: new FormControl(payment && payment.typeId || null, Validators.required),
    date: new FormControl(payment && payment.date || new Date()),
    now: new FormControl(payment && payment.isLocalPayment || false),
    amount: new FormControl(payment && payment.amount || 0),
    description: new FormControl(payment && payment.desc || ''),
  });
}
