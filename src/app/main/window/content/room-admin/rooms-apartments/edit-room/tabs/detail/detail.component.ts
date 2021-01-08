import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { RoomFeaturesComponent } from '@/app/main/window/shared/room-features/room-features.component';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../../loader-type';
import { ApartmentDetail, RoomListItem } from '../../../models';
import { LicenseComponent } from '../../../new-modal/license/license.component';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.pug',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent extends TabComponent implements OnInit, OnChanges {

  @Input() hasAdvancedPricing = false;

  form: FormGroup;
  details: ApartmentDetail;
  roomCategories: FormOption[];

  @ViewChild('roomFeatures', { static: false }) roomFeatures: RoomFeaturesComponent;

  get calendarLink() {
    const company = this.mainService.getCompanyDetails();

    if (company.c_showIcalLinks !== 'on') { return false; }
    // tslint:disable-next-line: max-line-length
    return `https://www.easy-booking.at/wo/Services/com/eBook/interfaces/ical.php?id=${company.dbName}&serial=${company.c_serialNumber}-${company.c_serialNumberAdvanced}&room_id=${this.details.id}`;
  }

  get showChildsRoom() {
    return this.details && Boolean(!this.details.parentEntity);
  }

  // TODO isAdmin
  get isAdmin() {
    return this.mainService.getCompanyDetails().au_isAdmin === 'on';
  }

  constructor(
    private apiClient: ApiClient,
    private mainService: MainService,
    public loaderService: LoaderService,
    private formData: FormDataService,
    private modal: ModalService
  ) {
    super();
  }

  async ngOnInit() {
    this.roomCategories = await this.formData.getRoomCategories();
  }

  @Loading(LoaderType.TAB)
  async init(item: RoomListItem) {
    this.details = await this.apiClient.getApartmentDetail(item.id).toPromise();

    this.form = new FormGroup({
      roomNo: new FormControl(this.details.roomNo),
      sortOrder: new FormControl(this.details.sortOrder),
      group: new FormControl(this.details.groupId),
      notBookable: new FormControl(this.details.adminOnly),
      childRooms: new FormArray(this.details.childRooms.map(room => {
        return new FormControl(room.isChildOfMine);
      }))
    });
  }

  @Loading(LoaderType.TAB)
  async save() {
    const form = this.form.getRawValue();
    const details: ApartmentDetail = {
      ...this.details,
      adminOnly: form.notBookable,
      childRooms: form.childRooms.map((r, i) => ({
        id: this.details.childRooms[i].id,
        uniqueNo: this.details.childRooms[i].uniqueNo,
        isChildOfMine: r
      })),
      groupId: form.group,
      roomNo: form.roomNo,
      sortOrder: form.sortOrder,
      features: this.roomFeatures.extractBody().body
    };

    const response = await this.apiClient.validateApartmentDetail(details.id, details.adminOnly).toPromise();
    // TODO license modal
    if (response.overLicense) {
      const licenseModal = this.modal.openForms('', LicenseComponent, {
        hidePrimaryButton: true
      });

      licenseModal.modalBody.init(response);
    }

    if (!response.overLicense || this.isAdmin) {
      await this.apiClient.saveApartmentDetail(details).toPromise();
      this.edited.emit();
    }
  }
}
