import { EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { Invoice, VersionDetail } from '../../models';
import { ModalBody } from './modal-body';

export abstract class EditInvoiceComponent implements ModalBody {

  public detail: VersionDetail;
  public invoice: Invoice;
  public close = new EventEmitter<boolean>();
  public isLoading: Observable<boolean>;

  protected constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.EDIT_INVOICE);
  }

  public init(detail: VersionDetail, invoice: Invoice) {
    this.detail = detail;
    this.invoice = invoice;
  }

  @Loading(LoaderType.EDIT_INVOICE)
  async onSaveEdit(detail: VersionDetail | null) {
    if (detail) {
      if (!this.invoice.bookingId) { throw new Error('bookingId required'); }
      await this.apiClient.editInvoiceVersionDetail(detail, this.invoice.bookingId, this.invoice.billingId).toPromise();
    }
    this.close.emit(true);
  }

  public extractDetail(): VersionDetail {
    return {
      ...this.detail
    };
  }
}
