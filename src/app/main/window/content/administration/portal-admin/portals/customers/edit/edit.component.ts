import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../../loader-types';
import { PortalAdminCustomer } from '../../../models';

@Component({
  selector: 'app-edit-portal-customer',
  templateUrl: './edit.component.pug',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnChanges {

  @Input() customer!: PortalAdminCustomer;
  @Output() update = new EventEmitter();

  form: FormGroup;

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  ngOnChanges({ customer }: SimpleChanges) {
    if (customer && customer.previousValue !== customer.currentValue) {
      this.form = new FormGroup({
        remoteId: new FormControl(this.customer.remoteId),
        comment: new FormControl(this.customer.comment),
        active: new FormControl(this.customer.active)
      });
    }
  }

  @Loading(LoaderType.INNER_TAB)
  async save() {
    const customer: PortalAdminCustomer = {
      ...this.customer,
      ...this.form.getRawValue()
    };
    await this.apiClient.savePortalCustomerDetail(customer).toPromise();
    this.update.emit();
  }
}
