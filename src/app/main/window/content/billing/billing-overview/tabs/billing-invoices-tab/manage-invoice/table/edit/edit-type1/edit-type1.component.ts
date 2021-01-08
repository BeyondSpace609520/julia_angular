import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { LoaderService } from '@/app/shared/loader.service';
import { Invoice, VersionDetail } from '../../../models';
import { EditInvoiceComponent } from '../modal.component';

@Component({
  selector: 'app-edit-type1',
  templateUrl: './edit-type1.component.pug'
})
export class EditType1Component extends EditInvoiceComponent {

  public alternativeText = new FormControl('');

  constructor(loaderService: LoaderService, apiClient: ApiClient) {
    super(loaderService, apiClient);
  }

  public init(detail: VersionDetail, invoice: Invoice): void {
    super.init(detail, invoice);
    this.alternativeText.setValue(detail.alternativeText);
  }

  public extractDetail(): VersionDetail {
    return {
      ...super.extractDetail(),
      alternativeText: this.alternativeText.value,
    };
  }
}
