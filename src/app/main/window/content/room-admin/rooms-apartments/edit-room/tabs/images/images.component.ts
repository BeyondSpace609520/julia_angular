import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { PicturesComponent } from '@/app/main/window/shared/image-selector/pictures.component';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../../loader-type';
import { RoomListItem } from '../../../models';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.pug',
  styleUrls: ['./images.component.sass']
})
export class ImagesComponent extends TabComponent implements OnInit {

  @ViewChild('picturesComponent', { static: true }) picturesComponent: PicturesComponent<unknown>;

  constructor(
    private apiClient: ApiClient,
    private modal: ModalService,
    public loaderService: LoaderService
  ) {
    super();
  }

  ngOnInit() {
  }

  init(item: RoomListItem) {
  }

  @Loading(LoaderType.TAB)
  async reset() {
    // tslint:disable-next-line: max-line-length
    const confirmed = await this.modal.openConfirm('BackEnd_WikiLanguage.EP_MSGCopyToRoomFromCatHeader', 'BackEnd_WikiLanguage.EP_MSGCopyToRoomFromCat');

    if (confirmed) {
      await this.apiClient.resetToCategoryPicture(this.item.id).toPromise();
      this.picturesComponent.loadPictures();
    }
  }
}
