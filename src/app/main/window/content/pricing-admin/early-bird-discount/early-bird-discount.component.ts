import { Component, OnDestroy, OnInit } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Discount } from '../../../shared/discount/models';
import { AddItemComponent } from './add-item/add-item.component';
import { LoaderType } from './loader-types';

@Component({
  selector: 'app-early-bird-discount',
  templateUrl: './early-bird-discount.component.pug',
  styleUrls: ['./early-bird-discount.component.sass']
})
export class EarlyBirdDiscountComponent implements OnInit, OnDestroy {

  list: Discount[] = [];
  selectedId: number;
  isLoading: Observable<boolean>;

  // TODO replace getter function with pipe or static variable
  get selected() {
    return this.list.find(l => l.id === this.selectedId);
  }

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient,
    private modal: ModalService,
    private eventBusService: EventBusService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  async load(): Promise<void> {
    this.list = await this.apiClient.getEarlyBirdDiscount().toPromise();
  }

  selectItem(item: Discount): void {
    this.selectedId = item.id;
  }

  addItem(): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.EBD_Header', AddItemComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert',
      ngbOptions: {
        size: 'sm'
      }
    });

    modalData.modalBody.formStateChange.pipe(
      untilDestroyed(this)
    ).subscribe(state => {
      modalData.modal.formStatus = state.valid;
    });

    modalData.modal.save.subscribe(async () => {
      this.selectedId = await modalData.modalBody.save();
      modalData.modal.close(true);
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
      this.load();
    });
  }

  onItemEdited(): void {
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    this.load();
  }

  @Loading(LoaderType.MANAGE)
  async deleteItem(item: Discount) {
    // tslint:disable-next-line: max-line-length
    const confirmed = await this.modal.openConfirm('BackEnd_WikiLanguage.EBD_ConfirmDeleteMessageHeader', 'BackEnd_WikiLanguage.EBD_ConfirmDeleteMessage');

    if (confirmed) {
      await this.apiClient.deleteEarlyBirdDiscountRate(item.id).toPromise();
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
      this.load();
    }
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy(): void {}
}
