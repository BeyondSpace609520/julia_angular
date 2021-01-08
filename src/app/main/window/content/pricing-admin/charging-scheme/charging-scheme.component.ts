import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Editor } from './edit/types';
import { LinkedCategoriesComponent } from './linked-categories/linked-categories.component';
import { LoaderType } from './loader-type';
import { AnyChargingScheme, ChargingScheme, ChargingSchemeDetail } from './models';
import { NewChargingComponent } from './new/new.component';

@Component({
  selector: 'app-charging-scheme',
  templateUrl: './charging-scheme.component.pug',
  styleUrls: ['./charging-scheme.component.sass']
})
export class ChargingSchemeComponent implements OnInit {

  items: ChargingScheme[];
  selected: ChargingSchemeDetail<AnyChargingScheme> | null = null;
  isLoading: Observable<boolean>;
  isLoadingItem: Observable<boolean>;

  @ViewChild('editor', { static: false }) editor: Editor;
  @ViewChild('linked', { static: false }) linked: LinkedCategoriesComponent;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient,
    private modal: ModalService,
    private eventBusService: EventBusService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.isLoadingItem = this.loaderService.isLoading(LoaderType.MANAGE);
  }

  @Loading(LoaderType.LOAD)
  async load(selectSchemeId?: number | null): Promise<void> {
    this.items = await this.apiClient.getChargingSchemes().toPromise();
    if (selectSchemeId) {
      const selectScheme = this.items.find(item => item.id === selectSchemeId);
      if (selectScheme) {
        this.selectItem(selectScheme);
      }
    }
  }

  @Loading(LoaderType.MANAGE)
  async selectItem(item: ChargingScheme): Promise<void> {
    this.selected = await this.apiClient.getChargingSchemeDetail(item.id).toPromise();
  }

  newScheme(): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.CSNEW_Title', NewChargingComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert'
    });

    modalData.modalBody.valid.subscribe(valid => modalData.modal.formStatus = valid);
    modalData.modal.save.subscribe(async () => {
      const newId = await modalData.modalBody.save();
      modalData.modal.close(true);
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
      this.load(newId);
    });
  }

  @Loading(LoaderType.MANAGE)
  async deleteScheme(scheme: ChargingScheme): Promise<void> {
    await this.apiClient.deleteChargingScheme(scheme.id).toPromise();
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    this.selected = null;
    this.load();
  }

  @Loading(LoaderType.MANAGE)
  async saveScheme(): Promise<void> {
    const body = this.editor.extract();

    await this.linked.save();
    await this.apiClient.saveChargingScheme(body).toPromise();
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    this.load();
  }

  @Loading(LoaderType.MANAGE)
  async copyScheme(scheme: ChargingScheme): Promise<void> {
    await this.apiClient.copyChargingScheme(scheme.id).toPromise();
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    this.load();
  }

  ngOnInit(): void {
    this.load();
  }
}
