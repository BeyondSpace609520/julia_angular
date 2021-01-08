import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { ModalFormsComponent } from 'easybooking-ui-kit/components/modal-forms/modal-forms.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { Invoice, Payment } from '../../models';

@Component({
  selector: 'app-send-confirmation',
  templateUrl: './send-confirmation.component.pug',
  styleUrls: ['./send-confirmation.component.sass']
})
export class SendConfirmationComponent implements OnDestroy {

  @Output() saved = new EventEmitter();

  public payment: Payment;
  public email = new FormControl('', Validators.email);
  public isLoading: Observable<boolean>;

  private invoice: Invoice;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.SEND_CONFIRMATION);
  }

  public init(modal: ModalFormsComponent, payment: Payment, invoice: Invoice): void {
    this.payment = payment;
    this.invoice = invoice;
    this.email.setValue(invoice.customer.email);

    modal.save.pipe(untilDestroyed(this)).subscribe(async () => {
      // tslint:disable-next-line: max-line-length
      // https://trello.com/c/2xuMrnhA/62-billing-billing-overview-edit-invoice-items-clickable-icons-and-buttons-part-1-2 (Send payment confirmation)

      await this.sendConfirmation();
      this.saved.emit();
      modal.close(true);
    });
    this.email.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      modal.formStatus = this.email.valid;
    });
  }

  @Loading(LoaderType.SEND_CONFIRMATION)
  public async sendConfirmation(): Promise<void> {
    if (this.invoice.customer.email !== this.email.value) {
      await this.apiClient.setCustomerEmail(this.invoice.customer.id, this.email.value).toPromise();
    }
    await this.apiClient.sendPaymentConfirmation(this.payment.isBookingPrepayment, this.payment.id).toPromise();
  }

  ngOnDestroy(): void {}
}
