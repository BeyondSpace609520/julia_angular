import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Discount } from '@/app/main/window/shared/discount/models';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { ManageItemComponent } from '../manage-item/manage-item.component';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.pug',
  styleUrls: ['./edit-item.component.sass']
})
export class EditItemComponent {
  @Input() discount!: Discount;
  @Output() edited = new EventEmitter<number>();
  @ViewChild('manage', { static: false }) manage!: ManageItemComponent;

  isFormValid = true;
  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MANAGE);
  }

  @Loading(LoaderType.MANAGE)
  async save() {
    const id = await this.apiClient.saveEarlyBirdDiscount(this.manage.extractForm()).toPromise();

    this.edited.emit(id);
  }

  public onFormStateChanged(state: FormState): void {
    this.isFormValid = state.valid;
  }
}
