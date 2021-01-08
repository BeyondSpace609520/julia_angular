import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { SpecialOffer, SpecialOfferPeriod, SpecialOfferPeriodPricing } from '../../models';
import { SpecialOfferPeriodView } from '../../shared/periods/models';
import { extractWeekDay } from '../../shared/periods/utils';

const LOAD_PERIOD_DETAILS = 'load-period-details';

@Component({
  selector: 'app-period-tab',
  templateUrl: './period.component.pug',
  styleUrls: ['./period.component.sass']
})
export class PeriodComponent implements OnChanges {

  @Input() offer!: SpecialOffer;
  @Output() saved = new EventEmitter();

  periods: SpecialOfferPeriodView[];
  selectedPeriodId: SpecialOfferPeriodView['id'];
  details: SpecialOfferPeriodPricing;
  isLoading: Observable<boolean>;

  // TODO replace getter function with pipe or static variable
  get selected() {
    return this.periods && this.periods.find(p => p.id === this.selectedPeriodId);
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LOAD_PERIOD_DETAILS);
  }

  @Loading(LoaderType.LOAD_TAB)
  async load(): Promise<void> {
    const periods = await this.apiClient.getSpecialOfferPeriods(this.offer).toPromise();

    this.periods = periods.map(p => ({
      ...p,
      fromWeekDay: extractWeekDay(p.fromDate),
      untilWeekDay: extractWeekDay(p.untilDate)
    }));
  }

  @Loading(LOAD_PERIOD_DETAILS)
  async selectItem(period: SpecialOfferPeriod): Promise<void> {
    this.selectedPeriodId = period.id;
    this.details = await this.apiClient.getSpecialOfferPeriodPricingDetails(period).toPromise();
  }

  @Loading(LOAD_PERIOD_DETAILS)
  async save(period: SpecialOfferPeriod, pricing: SpecialOfferPeriodPricing): Promise<void> {
    await this.apiClient.saveSpecialOfferPeriodPricing(period, pricing).toPromise();
    this.load();
    this.saved.emit();
  }

  @Loading(LOAD_PERIOD_DETAILS)
  async reset(period: SpecialOfferPeriod): Promise<void> {
    await this.apiClient.resetSpecialOfferPeriodPricing(period).toPromise();
    this.load();
    this.saved.emit();
  }

  async ngOnChanges({ offer }: SimpleChanges): Promise<void> {
    if (offer && offer.previousValue !== offer.currentValue) {
      this.load();
    }
  }
}
