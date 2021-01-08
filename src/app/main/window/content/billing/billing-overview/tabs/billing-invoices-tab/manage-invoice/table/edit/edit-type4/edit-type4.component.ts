import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { LoaderService } from '@/app/shared/loader.service';
import { Invoice, VersionDetail } from '../../../models';
import { EditInvoiceComponent } from '../modal.component';

@Component({
  selector: 'app-edit-type4',
  templateUrl: './edit-type4.component.pug'
})
export class EditType4Component extends EditInvoiceComponent {

  public invoiceText = new FormControl('');

  constructor(loaderService: LoaderService, apiClient: ApiClient) {
    super(loaderService, apiClient);
  }

  public init(detail: VersionDetail, invoice: Invoice): void {
    super.init(detail, invoice);
    this.invoiceText.setValue(detail.invoiceText);
  }

  public extractDetail(): VersionDetail {
    return {
      ...super.extractDetail(),
      invoiceText: this.invoiceText.value
    };
  }
}
