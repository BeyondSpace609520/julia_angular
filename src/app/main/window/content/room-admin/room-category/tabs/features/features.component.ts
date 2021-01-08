import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { CompanyDetails } from '@/app/main/models';
import { CopyToSection } from '@/app/main/window/shared/copy-to/copy-to.component';
import { openCopyToModal } from '@/app/main/window/shared/copy-to/modal';
import { RoomFeaturesComponent } from '@/app/main/window/shared/room-features/room-features.component';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { RawFeature } from '../../../../../shared/room-features/models';
import { LoaderType } from '../../loader-type';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-category-features',
  templateUrl: './features.component.pug',
  styleUrls: ['./features.component.sass']
})
export class FeaturesComponent extends TabComponent implements OnInit, OnChanges {

  @Input() companyDetails!: CompanyDetails;
  @Output() saved = new EventEmitter();

  roomType = new FormControl();
  roomTypes: { id: number, name: string }[];
  featuresData: RawFeature;
  hasAdvancedPricingModule: boolean;

  @ViewChild('features', { static: false }) features: RoomFeaturesComponent;

  constructor(
    private apiClient: ApiClient,
    private modal: ModalService,
    public loaderService: LoaderService,
  ) {
    super();
  }

  @Loading(LoaderType.LOAD_TAB)
  async save(forAll: boolean) {
    const { body, noBeds } = this.features.extractBody();

    if (noBeds) {
      return this.modal.openSimpleText('BackEnd_WikiLanguage.zeroBedsAlert', '');
    }

    await this.apiClient.saveFeatures(this.category.id, this.roomType.value, body, forAll).toPromise();
    this.saved.emit();
  }

  @Loading(LoaderType.LOAD_TAB)
  async copyTo() {
    // TODO for some reason features use a resources from EntityGroupPic class
    const categories = await this.apiClient.getPictureCategories(this.category.id).toPromise();
    const rooms = await this.apiClient.getPicturesRooms().toPromise();
    const modal = openCopyToModal(this.modal);

    const sections: CopyToSection[] = [
      {
        label: 'BackEnd_WikiLanguage.CTD_Category',
        items: categories.map(({ id, name }) => ({ id, label: name }))
      }
    ];

    if (this.hasAdvancedPricingModule) {
      sections.push({
        label: 'BackEnd_WikiLanguage.CTD_Rooms',
        items: rooms.map(id => ({ id, label: id }))
      });
    }

    modal.init(this.category.name, sections, async ([categoryIds, roomIds]) => {
      await this.apiClient.copyFeatures(this.category.id, categoryIds, roomIds).toPromise();
      this.saved.emit();
    });
  }

  @Loading(LoaderType.LOAD_TAB)
  async ngOnInit() {
    this.roomTypes = await this.apiClient.getRoomTypes().toPromise();
  }


  @Loading(LoaderType.LOAD_TAB)
  async ngOnChanges({category, companyDetails}: SimpleChanges) {
    if (category) {
      this.roomType.setValue(+this.category.raw.eg_entityType_id);
      this.featuresData = await this.apiClient.getFeatures(this.category.id).toPromise();
    }
    if (companyDetails) {
      this.hasAdvancedPricingModule = this.companyDetails.c_hasAdvancedPricingModule === 'on';
    }
  }
}
