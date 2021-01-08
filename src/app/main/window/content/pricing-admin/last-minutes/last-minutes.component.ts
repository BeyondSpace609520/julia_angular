import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
import { ManageItemComponent } from './manage-item/manage-item.component';
import { LastMinutesItem } from './models';

@Component({
  selector: 'app-last-minutes',
  templateUrl: './last-minutes.component.pug',
  styleUrls: ['./last-minutes.component.sass']
})
export class LastMinutesComponent implements OnInit, OnDestroy {

  list: LastMinutesItem[];
  selectedId: LastMinutesItem['id'];
  active = new FormControl(false);
  isLoading: Observable<boolean>;


  // TODO replace getter function with pipe or static variable
  get selected() {
    return this.list && this.list.find(item => item.id === this.selectedId);
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modal: ModalService,
    private eventBusService: EventBusService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_MINUTES);
    this.active.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.activateSync());
  }

  @Loading(LoaderType.LOAD_MINUTES)
  async activateSync(): Promise<void> {
    await this.apiClient.setLastMinutesActive(this.active.value).toPromise();
  }

  @Loading(LoaderType.LOAD_MINUTES)
  async load(): Promise<void> {
    const { list, enabled } = await this.apiClient.getLastMinutes().toPromise();

    this.list = list;
    this.active.setValue(enabled, { emitEvent: false });
  }

  selectItem(item: LastMinutesItem): void {
    this.selectedId = item.id;
  }

  addItem(): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.LM_NewLMPopUpTitle', ManageItemComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert',
      ngbOptions: {
        size: 'sm'
      }
    });
    const fromDate = new Date(Math.max(...this.list.map(item => item.untilDate.getTime())));
    const untilDate = new Date(fromDate);
    untilDate.setMonth(untilDate.getMonth() + 1);

    modalData.modalBody.compact = true;
    modalData.modalBody.init({ fromDate, untilDate } as LastMinutesItem);

    modalData.modalBody.formStateChange.pipe(
      untilDestroyed(this)
    ).subscribe(state => {
      modalData.modal.formStatus = state.valid;
    });

    modalData.modal.save.subscribe(async () => {
      await modalData.modalBody.save();
      modalData.modal.close(true);
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
      this.load();
    });
  }

  onItemEdited(): void {
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    this.load();
  }

  @Loading(LoaderType.LOAD_MINUTES)
  async deleteItem(item: LastMinutesItem): Promise<void> {
    // tslint:disable-next-line: max-line-length
    const confirmed = await this.modal.openConfirm('BackEnd_WikiLanguage.LM_ConfirmDeleteMessageHeader', 'BackEnd_WikiLanguage.LM_ConfirmDeleteMessage');

    if (confirmed) {
      await this.apiClient.deleteLastMinutesItem(item.id).toPromise();
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
      this.load();
    }
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {}
}
