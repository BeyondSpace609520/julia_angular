import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { ViewService } from '@/app/main/view/view.service';
import { conditionalRequired } from '@/app/main/window/shared/forms/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from '../loader-type';
import { ApartmentRoom, RoomType } from '../models';
// import { LicenseComponent } from './license/license.component';

@Component({
  selector: 'app-new-modal',
  templateUrl: './new-modal.component.pug',
  styleUrls: ['./new-modal.component.sass']
})
export class NewModalComponent implements OnInit, OnDestroy {

  roomTypes: { id: number, name: string }[];
  roomCategories: FormOption[];
  valid = new EventEmitter<boolean>();
  form: FormGroup;
  roomsRange: number[] = [0];
  isLoading: Observable<boolean>;

  // TODO replace getter function with pipe or static variable
  get isAdmin() {
    return this.mainService.getCompanyDetails().au_isAdmin === 'on';
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private formData: FormDataService,
    private mainService: MainService,
    // private modalService: ModalService,
    private viewService: ViewService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MODAL);
  }

  computeRoomsRange(): void {
    const count = +(this.form.get('number') as FormControl).value;

    this.roomsRange = new Array(count).fill(0).map((_, i) => i);
  }

  // TODO replace function with pipe or static variable
  addedRoomControl(index: number): AbstractControl {
    const array = this.form.get('rooms') as FormArray;
    const alreadyExist = Boolean(array.controls[index]);

    if (!alreadyExist) {
      const numControl = this.form.get('number') as FormControl;
      const required = numControl.valueChanges.pipe(startWith(numControl.value), map(num => index < +num));
      const no = new FormControl('', conditionalRequired(required));

      array.insert(index, new FormGroup({
        no,
        category: new FormControl(this.roomCategories[0].value),
        notBookable: new FormControl(false)
      }));
      no.updateValueAndValidity();
    }
    return array.controls[index];
  }

  private extractForm(): {roomType: number, rooms: ApartmentRoom[]} {
    const roomType: RoomType['id'] = +(this.form.get('roomType') as FormControl).value;
    const roomsNumber: number = +(this.form.get('number') as FormControl).value;
    const rooms: ApartmentRoom[] = (this.form.get('rooms') as FormArray).controls.slice(0, roomsNumber).map(c => ({
      no: String((c.get('no') as FormControl).value),
      categoryId: +(c.get('category') as FormControl).value,
      notBookable: (c.get('notBookable') as FormControl).value
    }));

    return {
      roomType,
      rooms
    };
  }

  @Loading(LoaderType.MODAL)
  async save(): Promise<void> {
    const { roomType, rooms } = this.extractForm();

    const response = await this.apiClient.validateRooms(roomType, rooms).toPromise();
    // TODO license modal
    if (response.overLicense) {
      // previous angular licenseComponent - not in use
      // const licenseModal = this.modal.openForms('', LicenseComponent, {
      //   hidePrimaryButton: true
      // });
      // licenseModal.modalBody.init(response);

      this.viewService.focusViewById('licenseUpsellingModule');
    }

    if (!response.overLicense || this.isAdmin) {
      await this.apiClient.insertRooms(roomType, rooms).toPromise();
    }
  }

  @Loading(LoaderType.MODAL)
  async ngOnInit(): Promise<void> {
    this.roomTypes = await this.apiClient.getRoomTypes().toPromise();
    this.roomCategories = await this.formData.getRoomCategories();

    this.form = new FormGroup({
      roomType: new FormControl(this.roomTypes[0].id),
      number: new FormControl(1),
      rooms: new FormArray([])
    });
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.valid.emit(this.form.valid));
    (this.form.get('number') as FormControl).valueChanges.pipe(untilDestroyed(this), debounceTime(200))
      .subscribe(() => this.computeRoomsRange());
  }

  ngOnDestroy(): void {}
}
