import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { Customer } from '@/app/main/window/shared/customer/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { CompanyCustomerAdminService } from '../../company-customer-admin.service';
import { LoaderType } from '../../loader-types';
import { CustomerBooking } from '../../models';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.pug',
  styleUrls: ['./booking.component.sass']
})
export class BookingComponent implements OnChanges {

  @Input() item: Customer;

  public list: CustomerBooking[] = [];
  public selectedItemId: CustomerBooking['id'];
  public activeTabId: string;
  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'detail',
        label: 'BackEnd_WikiLanguage.CCAB_BookingDetailTABHeader'
      },
      {
        id: 'rooms',
        label: 'BackEnd_WikiLanguage.CCAB_BookingEntityTABHeader'
      },
    ]
  };
  public showDeletedEntries = new FormControl(true);
  public isLoading: Observable<boolean>;

  // TODO replace getter function with pipe or static variable
  get selected() {
    return this.list.find(item => item.id === this.selectedItemId);
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private mainService: MainService,
    public customerService: CompanyCustomerAdminService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.CUSTOMER_BOOKING);
    this.showDeletedEntries.valueChanges.subscribe(() => this.load());
    this.mainService.isAdmin$.subscribe(isAdmin => {
      if (isAdmin) {
        // add Loggin tab only for admins
        this.tabSettings.buttons.push({
          id: 'log',
          label: 'BackEnd_WikiLanguage.bookingLogTabTitle',
        });
      } else {
        this.tabSettings.buttons = this.tabSettings.buttons.filter(tab => tab.id !== 'log');
      }
    });
  }

  public selectItem(item: CustomerBooking): void {
    this.selectedItemId = item.id;
    this.activeTabId = 'detail';
  }

  @Loading(LoaderType.CUSTOMER_BOOKING)
  private async load(): Promise<void> {
    const showDeleted = this.customerService.advancedMode && this.showDeletedEntries.value;

    this.list = await this.apiClient.getCompanyCustomerBooking(this.item.id, showDeleted).toPromise();
  }

  ngOnChanges({ item }: SimpleChanges): void {
    if (item && item.currentValue !== item.previousValue) {
      this.load();
    }
  }
}
