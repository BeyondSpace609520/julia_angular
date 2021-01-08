import { Component, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-type';
import { ManagePeriodComponent } from '../manage-period/manage-period.component';
import { SeasonPeriod } from '../models';

@Component({
  selector: 'app-new-period-modal',
  templateUrl: './new-period-modal.component.pug',
  styleUrls: ['./new-period-modal.component.sass']
})
export class NewPeriodModalComponent {

  @ViewChild('form', { static: true }) form: ManagePeriodComponent;

  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.ADD_DETAIL);
  }

  async init(periods: SeasonPeriod[]): Promise<void> {
    this.form.loadCopyList(periods);
    await this.form.loadForm();
  }

  @Loading(LoaderType.ADD_DETAIL)
  async submit(): Promise<number> {
    const formData = this.form.extractFormDetail();

    return await this.apiClient.addSeasonPeriod(formData, formData.copyFromId).toPromise();
  }
}
