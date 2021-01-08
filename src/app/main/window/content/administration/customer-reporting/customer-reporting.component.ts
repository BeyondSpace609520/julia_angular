import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { BillableCustomer } from './models';

enum LoaderType {
  LOAD = 'load-customer-reporting'
}

@Component({
  selector: 'app-customer-reporting',
  templateUrl: './customer-reporting.component.pug',
  styleUrls: ['./customer-reporting.component.sass']
})
export class CustomerReportingComponent implements OnInit {

  public items: BillableCustomer[] = [];
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async refresh(): Promise<void> {
    this.items = await this.apiClient.getBillableCustomers().toPromise();
  }

  ngOnInit(): void {
    this.refresh();
  }
}
