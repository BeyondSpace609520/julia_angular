import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { DiscountDetailsComponent } from '@/app/main/window/shared/discount/details/details.component';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { LongStayDiscountRate } from '../../models';

@Component({
  selector: 'app-manage-rate',
  templateUrl: './manage-rate.component.pug',
  styleUrls: ['./manage-rate.component.sass']
})
export class ManageRateComponent implements OnDestroy {

  @Input() rate!: LongStayDiscountRate | null;
  @Input() extraFields = true;
  @Output() formStateChange = new EventEmitter<FormState>();
  @ViewChild('details', { static: false }) details: DiscountDetailsComponent;

  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MANAGE_RATE);
  }

  @Loading(LoaderType.MANAGE_RATE)
  async selectTranslation(localeId: number): Promise<void> {
    if (!this.rate) { return; }
    const translation = await this.apiClient.getLongStayDiscountTranslation(localeId, this.rate.id).toPromise();

    this.details.setDesignation(translation);
  }

  @Loading(LoaderType.MANAGE_RATE)
  async save(id: number, discountId: number): Promise<void> {
    const data: LongStayDiscountRate = {
      id,
      discountId,
      ...this.details.extractForm()
    };

    await this.apiClient.saveLongStayDiscountRate(data).toPromise();
  }

  loadForm(item?: LongStayDiscountRate): void {
    this.details.loadForm(item);
  }

  ngOnDestroy(): void {}
}
