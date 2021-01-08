import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-type';
import { ManagePeriodComponent } from '../manage-period/manage-period.component';

@Component({
  selector: 'app-edit-period',
  templateUrl: './edit-period.component.pug',
  styleUrls: ['./edit-period.component.sass']
})
export class EditPeriodComponent implements OnChanges {

  @Input() periodId!: number;
  @Output() edited = new EventEmitter<number>();
  @ViewChild('form', { static: true }) form: ManagePeriodComponent;

  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_DETAIL);
  }

  @Loading(LoaderType.LOAD_DETAIL)
  async loadDetails(periodId: number): Promise<void> {
    await this.form.loadForm(periodId);
  }

  @Loading(LoaderType.LOAD_DETAIL)
  async submit(): Promise<void> {
    const formData = this.form.extractFormDetail();

    if (await this.canSubmit()) {
      await this.apiClient.editSeasonPeriod(this.periodId, formData).toPromise();
      this.edited.emit(this.periodId);
    }
  }

  async canSubmit(): Promise<boolean> {
    if (!this.form.anyDayChecked()) {
      this.modalService.openSimpleText('BackEnd_WikiLanguage.SP_ChooseAtLeastOneArrivalAndDepartureDayMsg', undefined, {
        hidePrimaryButton: true
      });
      return false;
    }
    // tslint:disable-next-line: max-line-length
    const confirmed = await this.modalService.openConfirm('BackEnd_WikiLanguage.SP_ConfirmUpdateAllSPEMessageHeader', 'BackEnd_WikiLanguage.SP_ConfirmUpdateAllSPEMessage', {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Yes',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_No',
    });

    return confirmed;
  }

  ngOnChanges({ periodId }: SimpleChanges): void {
    if (periodId.currentValue !== periodId.previousValue) {
      this.loadDetails(periodId.currentValue);
    }
  }
}
