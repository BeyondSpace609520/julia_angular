import { Component, Input, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-type';
import { RoomListItem } from './models';
import { NewModalComponent } from './new-modal/new-modal.component';

@Component({
  selector: 'app-rooms-apartments',
  templateUrl: './rooms-apartments.component.pug',
  styleUrls: ['./rooms-apartments.component.sass']
})
export class RoomsApartmentsComponent implements OnInit {

  @Input() preselectRoomId?: number;
  @Input() preselectTabId?: string;

  list: RoomListItem[] = [];
  selectedItem: RoomListItem;
  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private modal: ModalService,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private eventBusService: EventBusService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.APARTMENTS);
  }

  async onTabSaved(tabId?: string): Promise<void> {
    await this.loadList();
    sendRoomplanUpdate(this.eventBusService, 'roomAdminChanged');
    if (tabId === 'separator') {
      sendRoomplanUpdate(this.eventBusService, 'separatorChanged');
    }
    if (tabId === 'detail') {
      sendRoomplanUpdate(this.eventBusService, 'equipmentChanged');
    }
  }

  @Loading(LoaderType.APARTMENTS)
  async loadList(): Promise<void> {
    this.list = await this.apiClient.getRoomsAndApartments().toPromise();
  }

  selectItem(item: RoomListItem): void {
    this.selectedItem = item;
  }

  @Loading(LoaderType.APARTMENTS)
  async newSeparator(): Promise<void> {
    await this.apiClient.putSeparator(0, 0).toPromise();
    await this.loadList();
  }

  newRoom(): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.generic_New', NewModalComponent, {
      disableClose: false,
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert'
    });

    modalData.modalBody.valid.subscribe(valid => modalData.modal.formStatus = valid);

    modalData.modal.save.subscribe(async () => {
      await modalData.modalBody.save();
      await modalData.modal.close(true);
      await this.loadList();
    });
  }

  private async translateItemMessage(msg: string, item: RoomListItem): Promise<string> {
    return await this.translate.get(msg, { e_uniqueNo: item.uniqueNo }).toPromise();
  }

  @Loading(LoaderType.APARTMENTS)
  async deleteItem(item: RoomListItem): Promise<void> {
    if (item.isSeparator) {
      await this.apiClient.deleteApartmentsSeparator(item.id).toPromise();
      await this.loadList();
    } else {
      const response = await this.apiClient.checkBeforeRoomDeletion(item.id, item.uniqueNo).toPromise();

      switch (response.status) {
        case 'BOOKINGS_IN_FUTURE':
          // tslint:disable-next-line: max-line-length
          this.modal.openSimpleText('BackEnd_WikiLanguage.deactRoom_Header', await this.translateItemMessage('BackEnd_WikiLanguage.deactRoom_msg2', item));
          break;
        case 'OK':
          // tslint:disable-next-line: max-line-length
          const confirmed = await this.modal.openConfirm('BackEnd_WikiLanguage.deactRoom_Header', await this.translateItemMessage('BackEnd_WikiLanguage.deactRoom_msg1', item));

          if (confirmed) {
            await this.apiClient.deleteApartment(item.id).toPromise();
            await this.loadList();
          }
          break;
      }
    }
  }

  async ngOnInit(): Promise<void> {
    await this.loadList();
    if (this.preselectRoomId) {
      const preselectedRoom = this.list.find(room => room.id === this.preselectRoomId);
      if (preselectedRoom) {
        this.selectItem(preselectedRoom);
      }
      this.preselectRoomId = undefined;
    }
  }
}
