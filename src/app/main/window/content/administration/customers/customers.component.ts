import { Component, OnInit } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Colors } from './consts';
import { LoaderType } from './loader-types';
import { CustomerItem } from './models';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.pug',
  styleUrls: ['./customers.component.sass']
})
export class CustomersComponent implements OnInit {

  public activeTabId = 'details';
  public items: CustomerItem[] = [];
  public filter = '';
  public selectedItem: CustomerItem | null = null;
  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'details',
        label: 'BackEnd_WikiLanguage.RCAD_TABHeader'
      },
      {
        id: 'users',
        label: 'BackEnd_WikiLanguage.RCAU_TABHeader'
      },
      {
        id: 'login',
        label: 'BackEnd_WikiLanguage.LM_LoginMessage'
      }
    ]
  };

  public isLoading: Observable<boolean>;
  public isTabLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.isTabLoading = this.loaderService.isLoading(LoaderType.TAB);
  }

  public getItemColor(item: CustomerItem): string {
    return Colors[item.status];
  }

  @Loading(LoaderType.LOAD)
  public async load(): Promise<void> {
    const selectedId: number | null = this.selectedItem ? this.selectedItem.id : null;
    this.items = await this.apiClient.getCustomers().toPromise();
    if (selectedId) {
      this.selectedItem = this.items.find(item => item.id === selectedId) || null;
    }
  }

  public selectItem(item: CustomerItem): void {
    this.selectedItem = item;
  }

  async ngOnInit(): Promise<void> {
    this.load();
  }
}
