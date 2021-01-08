import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { ManageItemComponent } from '../manage-item/manage-item.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.pug',
  styleUrls: ['./add-item.component.sass']
})
export class AddItemComponent {
  @Output() formStateChange = new EventEmitter<FormState>();
  @ViewChild('manage', { static: true }) manage!: ManageItemComponent;

  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.ADD);
  }

  @Loading(LoaderType.ADD)
  async save(): Promise<number> {
    return await this.apiClient.saveEarlyBirdDiscount(this.manage.extractForm()).toPromise();
  }
}
