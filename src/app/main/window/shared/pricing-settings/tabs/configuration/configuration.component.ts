import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { SeasonPeriod } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { PeriodConfigComponent } from '@/app/main/window/shared/period-config/period-config.component';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-type';
import { PricingConfig, PricingSource } from '../../models';

@Component({
  selector: 'app-prices-configuration-tab',
  templateUrl: './configuration.component.pug',
  styleUrls: ['./configuration.component.sass']
})
export class ConfigurationTabComponent implements OnChanges {

  @Input() source!: PricingSource;
  @Input() period!: SeasonPeriod;
  @Output() saved = new EventEmitter();

  periodConfig: PricingConfig;
  sourceConfig: PricingConfig;

  finalClean = new FormControl();

  @ViewChild('sourceConfigComponent', { static: false }) sourceConfigComponent: PeriodConfigComponent;

  get title() { // TODO
    return `BackEnd_WikiLanguage.${this.source.type === 'category' ? 'EP_CategoryPricingConfig' : 'EP_PricingConfig'}`;
  }

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  async ngOnChanges({ source, period }: SimpleChanges) {
    if (source && source.previousValue !== source.currentValue
      || period && period.previousValue !== period.currentValue ) {
        this.load();
    }
  }

  @Loading(LoaderType.PRICING)
  async load() {
    const { period, source } = await this.apiClient.getPricesConfig(this.source, this.period.id).toPromise();

    this.periodConfig = period;
    this.sourceConfig = source;
    this.finalClean.setValue(source.finalCleanUp);
  }

  @Loading(LoaderType.PRICING)
  async save() {
    const body = {
      id: this.sourceConfig.id,
      fromDate: null as any, // TODO
      untilDate: null as any,
      finalCleanUp: +this.finalClean.value,
      ...this.sourceConfigComponent.extractFormDetail()
    };

    await this.apiClient.savePricesConfig(body, this.source).toPromise();

    this.saved.emit();
  }
}
