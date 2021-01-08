import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { CompanyDetails } from '@/app/main/models';
import { CopyToSection } from '@/app/main/window/shared/copy-to/copy-to.component';
import { openCopyToModal } from '@/app/main/window/shared/copy-to/modal';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-type';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-category-pictures',
  templateUrl: './pictures.component.pug',
  styleUrls: ['./pictures.component.sass']
})
export class PicturesComponent extends TabComponent {

  @Input() companyDetails!: CompanyDetails;
  @Output() saved = new EventEmitter();

  constructor(
    private apiClient: ApiClient,
    private modal: ModalService,
    public loaderService: LoaderService
  ) {
    super();
  }

  @Loading(LoaderType.LOAD_TAB)
  async copyTo() {

    const sections: CopyToSection[] = [];

    const categories = await this.apiClient.getPictureCategories(this.category.id).toPromise();
    sections.push({
      label: 'BackEnd_WikiLanguage.CTD_Category',
      items: categories.map(({ id, name }) => ({ id, label: name }))
    });

    if (this.companyDetails.c_hasAdvancedPricingModule === 'on') {
      const rooms = await this.apiClient.getPicturesRooms().toPromise();
      sections.push({
        label: 'BackEnd_WikiLanguage.CTD_Rooms',
        items: rooms.map(id => ({ id, label: id }))
      });
    }

    const modal = openCopyToModal(this.modal);

    modal.init(this.category.name, sections, async ([categoryIds, roomIds]) => {
      await this.apiClient.copyPicture(this.category.id, categoryIds, roomIds).toPromise();
    });
  }
}
