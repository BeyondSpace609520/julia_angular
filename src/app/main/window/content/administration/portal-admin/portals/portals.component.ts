import { Component, OnInit } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { PortalAdmin } from '../models';
import { AddPortalComponent } from './add-portal/add-portal.component';

@Component({
  selector: 'app-portals',
  templateUrl: './portals.component.pug',
  styleUrls: ['./portals.component.sass']
})
export class PortalsComponent implements OnInit {

  public items: PortalAdmin[] = [];
  public selectedItem?: { id: PortalAdmin['id'], canDelete: boolean };

  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'config',
        label: 'BackEnd_WikiLanguage.POA_ConfigTAB'
      },
      {
        id: 'customers',
        label: 'BackEnd_WikiLanguage.POA_CustomersTAB'
      },
      {
        id: 'categories',
        label: 'BackEnd_WikiLanguage.POA_PackageCategoriesTAB'
      }
    ],
    buttonClasses: ['nav-link']
  };
  public activeTabId = 'config';
  public selected: PortalAdmin | undefined;

  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modal: ModalService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.INNER_TAB);
  }

  @Loading(LoaderType.TAB)
  public async refresh(): Promise<void> {
    this.items = await this.apiClient.getAdminPortals().toPromise();
  }

  @Loading(LoaderType.TAB)
  public async selectItem(id: PortalAdmin['id']): Promise<void> {
    const canDelete = (await this.apiClient.getAdminPortalCustomers(id).toPromise()).length === 0;

    this.selectedItem = { id, canDelete };
    this.selected = this.items.find(item => item.id === (this.selectedItem && this.selectedItem.id));
  }

  public newPortal(): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.POA_NewPortal', AddPortalComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert'
    });

    modalData.modalBody.form.statusChanges.subscribe(status => {
      modalData.modal.formStatus = status === 'VALID';
    });
    modalData.modal.save.subscribe(async () => {
      const id = await modalData.modalBody.insert();
      await this.selectItem(id);
      await this.refresh();
      modalData.modal.close(true);
    });
  }

  @Loading(LoaderType.TAB)
  public async deletePortal(portal: PortalAdmin): Promise<void> {
    const confirmed = await this.modal.openConfirm(
      'BackEnd_WikiLanguage.POA_PortalConfirmDeleteMessageHeader',
      'BackEnd_WikiLanguage.POA_PortalConfirmDeleteMessage'
    );

    if (confirmed) {
      await this.apiClient.deletePortal(portal.id).toPromise();
      await this.refresh();
    }
  }

  ngOnInit(): void {
    this.refresh();
  }
}
