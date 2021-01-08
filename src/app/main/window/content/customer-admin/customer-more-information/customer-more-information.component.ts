import { Component, Input, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Window } from '../../../models';
import { CustomerFormComponent } from '../../../shared/customer/form/form.component';
import { EventBusService } from '../../../shared/event-bus';
import { WindowsService } from '../../../windows.service';
import { UpdateCustomer } from '../company-customer-admin/events';
import { LoaderType } from './loader-types';
import { Guest } from './models';

@Component({
  selector: 'app-customer-more-information',
  templateUrl: './customer-more-information.component.pug',
  styleUrls: ['./customer-more-information.component.sass']
})
export class CustomerMoreInformationComponent {

  @Input() customer!: Guest;
  @Input() window!: Window;

  @ViewChild('form', { static: true }) form: CustomerFormComponent<Guest>;

  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private windowsService: WindowsService,
    private eventBus: EventBusService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  public async save(): Promise<void> {
    const customer = this.form.extract();

    await this.apiClient.saveBookingGuest(customer).toPromise();
    this.eventBus.emit<UpdateCustomer>('updateCustomer', { customerId: this.customer.id });
  }

  public cancel(): void {
    return this.windowsService.closeWindow(this.window);
  }
}
