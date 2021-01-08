import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { PortalAdmin, PortalAdminCustomerSearched } from '../../../models';

const SEARCH = 'search-portal-admin-customers';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.pug',
  styleUrls: ['./add.component.sass']
})
export class AddPortalCustomerComponent {

  @Input() portal!: PortalAdmin;
  @Output() selectCustomer = new EventEmitter<PortalAdminCustomerSearched['customerId'] | undefined>();

  public text = '';

  public customers: PortalAdminCustomerSearched[] = [];
  public selectedId?: PortalAdminCustomerSearched['customerId'];

  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(SEARCH);
  }

  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  @Loading(SEARCH)
  public async search(): Promise<void> {
    this.customers = await this.apiClient.searchAdminPortalCustomers(this.text, this.portal.id).toPromise();
    this.selectCustomer.emit();
  }
}
