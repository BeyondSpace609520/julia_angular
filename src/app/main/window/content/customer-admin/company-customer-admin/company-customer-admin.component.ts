import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { fromEvent, Observable } from 'rxjs';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { PermissionService } from '@/app/main/permission/permission.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Customer } from '../../../shared/customer/models';
import { selectFileDialog } from '../../../shared/forms/file-dialog';
import { CompanyCustomerAdminService } from './company-customer-admin.service';
import { ExportComponent } from './export/export.component';
import { LoaderType } from './loader-types';
import tabs from './tabs/list';

@Component({
  selector: 'app-company-customer-admin',
  templateUrl: './company-customer-admin.component.pug',
  styleUrls: ['./company-customer-admin.component.sass'],
  providers: [CompanyCustomerAdminService]
})
export class CompanyCustomerAdminComponent implements OnInit, OnDestroy {

  @Input() customerId?: number;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  public items: Customer[] | null = null;
  public selectedItemId: number | null = null;
  public selectedGuest?: Customer;
  public activeTabId = 'rating';
  public isLoading: Observable<boolean>;
  public isLoadingSearch: Observable<boolean>;
  public isLoadingTab: Observable<boolean>;

  // TODO replace getter function with pipe or static variable
  get tabSettingsButtons(): TabsSettings['buttons'] {
    if (!this.selectedGuest) { return []; }
    if (this.selectedGuest && !this.selectedGuest.id) { return [tabs.detail]; }
    const buttons: TabsSettings['buttons'] = [];

    if (this.permissionService.can.seeRating) { buttons.push(tabs.rating); }

    buttons.push(
      tabs.detail,
      tabs.booking,
      tabs.interaction
    );
    return buttons;
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    public permissionService: PermissionService,
    private modalService: ModalService,
    private auth: AuthService,
    private mainService: MainService,
    private service: CompanyCustomerAdminService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.GENERAL);
    this.isLoadingSearch = this.loaderService.isLoading(LoaderType.SEARCH);
    this.isLoadingTab = this.loaderService.isLoading(LoaderType.TAB);
    fromEvent(document, 'keydown').pipe(untilDestroyed(this)).subscribe((e: KeyboardEvent) => {
      if (e.ctrlKey && (e.code === 'KeyH' || e.key === '.') && document.activeElement === this.searchInput.nativeElement) {
        e.preventDefault();
        this.service.advancedMode = true;
      }
    });
  }

  @Loading(LoaderType.SEARCH)
  public async onSearch(text: string, id?: number): Promise<void> {
    this.items = await this.apiClient.getCompanyCustomers(text).toPromise();
    if (id) {
      this.selectItem(undefined, id);
    }
  }

  @Loading(LoaderType.SEARCH)
  public async loadCustomer(customerId: number): Promise<void> {
    this.items = await this.apiClient.getCompanyCustomers('', customerId).toPromise();
    if (this.items.length === 1) {
      // automatically load customer if found
      this.selectItem(this.items[0]);
    }
  }

  public async onExport(): Promise<void> {
    if (!this.permissionService.can.export) { return; }

    this.modalService.openGeneric('BackEnd_WikiLanguage.PP_Header', ExportComponent, {
      disableClose: true
    });
  }

  @Loading(LoaderType.GENERAL)
  public async onImport(): Promise<void> {
    const file = await selectFileDialog('.csv');
    const { customerId } = this.auth.getQueryParams();
    const sugarId = this.mainService.getCompanyDetails().c_sugarId;

    if (file) {
      try {
        await this.apiClient.feratelImport(+customerId, sugarId, file).toPromise();
        this.modalService.openSimpleText('BackEnd_WikiLanguage.FeratelImportSuccessful');
      } catch (e) {
        this.modalService.openSimpleText('BackEnd_WikiLanguage.MW_ImportErrorWrongFormat');
      }
    }
  }

  public selectItem(item?: Customer, id?: number): void {
    if (id) {
      this.selectedItemId = id;
    } else {
      this.selectedItemId = (item && item.id) ? item.id : null;
    }
    if (this.items) {
      const selectedGuest = this.items.find(i => i.id === this.selectedItemId);
      if (selectedGuest) {
        this.selectedGuest = selectedGuest;
      }
    }
  }

  public createNewCustomer(): void {
    this.selectedItemId = null;
    this.selectedGuest = {} as Customer;
    this.activeTabId = 'detail';
  }

  ngOnInit(): void {
    if (this.customerId) {
      this.loadCustomer(this.customerId);
    }
  }

  ngOnDestroy(): void {}
}
