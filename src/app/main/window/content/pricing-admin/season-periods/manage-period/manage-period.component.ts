import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { PeriodConfigComponent } from '@/app/main/window/shared/period-config/period-config.component';
import { SeasonPeriod, SeasonPeriodDetail } from '../models';

export type ExtractedData = SeasonPeriodDetail & { id?: number, copyFromId: number };

@Component({
  selector: 'app-manage-period',
  templateUrl: './manage-period.component.pug',
  styleUrls: ['./manage-period.component.sass']
})
export class ManagePeriodComponent implements OnDestroy {
  @Input() periodId!: number | null;
  @Output() refresh = new EventEmitter<number>();

  form: FormGroup;
  detail: SeasonPeriodDetail | null;
  copyList: SeasonPeriod[] | null = null;

  @ViewChild('periodConfig', { static: false }) periodConfig: PeriodConfigComponent;

  constructor(
    private apiClient: ApiClient
  ) { }

  public async loadForm(periodId?: number) {
    const detail = this.detail = periodId ? await this.apiClient.getSeasonPeriodDetail(periodId).toPromise() : null;

    this.form = new FormGroup({
      name: new FormControl(detail && detail.name),
      fromDate: new FormControl(detail && detail.fromDate || this.getDefaultDate(0)),
      untilDate: new FormControl(detail && detail.untilDate || this.getDefaultDate(28)),
      active: new FormControl(detail && detail.active || false),
      minUnit: new FormControl(detail && detail.minUnit || 3),
      chargeType: new FormControl(detail && detail.chargeType || 'PricePerPersonPerNight'),
      charge: new FormControl(detail && detail.charge || 10),
      gapFill: new FormControl(false),
      copyFromId: new FormControl(null),
    });
  }

  private getDefaultDate(offset: number) {
    const date = (this.copyList && this.copyList.length > 0) ? new Date(this.copyList[0].untilDate.getTime()) : new Date();

    date.setDate(date.getDate() + offset);

    return date;
  }

  public loadCopyList(periods: SeasonPeriod[]) {
    this.copyList = periods;
  }

  public extractFormDetail(): ExtractedData {
    const data = this.form.getRawValue();
    const configData = this.periodConfig ? this.periodConfig.extractFormDetail() : {};

    return {
      id: this.detail && this.detail.id,
      ...data,
      ...configData,
      copyFromId: data.copyFromId || undefined
    };
  }

  public anyDayChecked() {
    return this.periodConfig && this.periodConfig.anyDayChecked();
  }

  ngOnDestroy() {}
}
