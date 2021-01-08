import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { sort } from '@/app/main/window/shared/table/sort';
import { SortEvent } from '@/app/main/window/shared/table/sortable.directive';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { PortalAdmin, PortalAdminCustomer } from '../../models';
import { AddPortalCustomerComponent } from './add/add.component';

@Component({
  selector: 'app-portal-customers',
  templateUrl: './customers.component.pug',
  styleUrls: ['./customers.component.sass']
})
export class CustomersComponent implements OnChanges {

  @Input() portal!: PortalAdmin;

  customers: PortalAdminCustomer[] = [];
  sortedCustomers: PortalAdminCustomer[] = [];

  selected?: PortalAdminCustomer;

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService,
    private modal: ModalService
  ) { }

  sort(rule: SortEvent | null) {
    this.sortedCustomers = sort(this.customers, rule);
  }

  @Loading(LoaderType.INNER_TAB)
  async load() {
    this.customers = await this.apiClient.getAdminPortalCustomers(this.portal.id).toPromise();
    this.sort(null);
  }

  @Loading(LoaderType.INNER_TAB)
  async delete(customer: PortalAdminCustomer) {
    await this.apiClient.deleteAdminPortalCustomer(customer.id).toPromise();
    this.load();
  }

  addCustomer() {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.generic_Search', AddPortalCustomerComponent, {
      ngbOptions: {
        size: 'lg'
      }
    });
    let customerId: number | undefined;

    modalData.modal.formStatus = false;
    modalData.modalBody.portal = this.portal;
    modalData.modalBody.selectCustomer.subscribe((c: number | undefined) => {
      modalData.modal.formStatus = Boolean(c);
      customerId = c;
    });
    modalData.modal.save.subscribe(async () => {
      if (customerId) {
        await this.apiClient.addPortalCustomer(customerId, this.portal.id).toPromise();
        this.load();
        modalData.modal.close(true);
      }
    });
  }

  ngOnChanges({ portal }: SimpleChanges) {
    if (portal && portal.currentValue !== portal.previousValue) {
      this.load();
    }
  }
}
