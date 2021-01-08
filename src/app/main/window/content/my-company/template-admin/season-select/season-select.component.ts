import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { SeasonPeriod } from '../../../pricing-admin/season-periods/models';
import { LoaderType } from '../loader-types';
import { EmailTemplate } from '../models';

@Component({
  selector: 'app-season-select',
  templateUrl: './season-select.component.pug',
  styleUrls: ['./season-select.component.sass']
})
export class SeasonSelectComponent implements OnInit, OnChanges {

  @Input() control!: FormControl;
  @Input() localeId!: number;
  @Input() template?: EmailTemplate;
  @Input() disabled = false;

  periods: SeasonPeriod[] = [];
  specificSeasonPeriodsId: SeasonPeriod['id'][];

  public get period() {
    return this.periods.find(p => p.id === +this.control.value);
  }

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  public async updatePeriods() {
    if (this.template) {
      this.specificSeasonPeriodsId = await this.apiClient.getSpecificSeasonPeriodsIdForEmailTemplate(
        this.template.id,
        this.localeId
      ).toPromise();
    }
  }

  private setDisabledState(): void {
    if (this.disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  @Loading(LoaderType.Load)
  async ngOnInit() {
    this.periods = await this.apiClient.getSeasonPeriods().toPromise();
  }

  @Loading(LoaderType.Load)
  async ngOnChanges({ template, localeId, disabled }: SimpleChanges) {
    if ((template && template.currentValue !== template.previousValue)
     || (localeId && localeId.currentValue !== localeId.previousValue)) {
      await this.updatePeriods();
    }
    if (disabled) {
      this.setDisabledState();
    }
  }
}
