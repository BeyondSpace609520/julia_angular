import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../../content/billing/billing-overview/tabs/billing-invoices-tab/manage-invoice/loader-types';
import { Customer } from '../models';
import { reduceCustomer } from '../reduce';

@Component({
  selector: 'app-choose-customer',
  templateUrl: './choose-customer.component.pug',
  styleUrls: ['./choose-customer.component.sass']
})
export class ChooseCustomerComponent {

  textControl: FormControl;
  excludeCustomerId?: number;
  // TODO change this to @Output()
  customerSelected: (item: Customer) => void;
  customers: Customer[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.SEARCH_CUSTOMERS);
  }

  @Loading(LoaderType.SEARCH_CUSTOMERS)
  async onSearch(): Promise<void> {
    const customers = await this.apiClient.searchCustomers(this.textControl.value, this.excludeCustomerId).toPromise();

    this.customers = customers.map(reduceCustomer);
  }

  init(text: string, excludeCustomerId: number | undefined, customerSelected: (item: Customer) => void): void {
    this.textControl = new FormControl(text);
    this.excludeCustomerId = excludeCustomerId;
    this.customerSelected = customerSelected;
    this.onSearch();
  }
}
