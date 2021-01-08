import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { PermissionService } from '@/app/main/permission/permission.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { SeasonPeriod } from '../../content/pricing-admin/season-periods/models';
import { LoaderType } from './loader-type';
import { PricingSource } from './models';
import { PricesService } from './prices.service';

@Component({
  selector: 'app-pricing-settings',
  templateUrl: './prices.component.pug',
  styleUrls: ['./prices.component.sass'],
  providers: [
    PricesService
  ]
})
export class PricesComponent implements OnInit {

  @Input() source!: PricingSource;
  @Input() canResetGroups = true;
  @Input() hasCaterings = true;
  @Input() saveForAllByDefault = true;
  @Input() extraActionsTemplate!: any;
  @Input() additionalInfoTemplate!: any;
  @Output() saved = new EventEmitter();

  activeTabId = 'prices';
  tabSettings: TabsSettings = {
    buttons: []
  };
  periods: SeasonPeriod[] = [];
  selectedPeriodId: number | null = null;
  isLoading: Observable<boolean>;

  // TODO replace getter function with pipe or static variable
  get selectedPeriod() {
    return this.periods.find(p => p.id === this.selectedPeriodId);
  }

  constructor(
    private apiClient: ApiClient,
    private permission: PermissionService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.PRICING);
    this.tabSettings.buttons.push({
      id: 'prices',
      label: 'BackEnd_WikiLanguage.EG_PricingPricing'
    });
    if (this.permission.can.seeAdvancedPricing) {
      this.tabSettings.buttons.push({
        id: 'configuration',
        label: 'BackEnd_WikiLanguage.EG_PricingSeasonConfig'
      });
    }
  }

  async preparePeriods(): Promise<{periods: SeasonPeriod[], currentPeriod?: SeasonPeriod}> {
    const periods = await this.apiClient.getSeasonPeriods().toPromise();
    const time = Date.now();
    const currentPeriod = periods.find(p => p.fromDate.getTime() < time && p.untilDate.getTime() > time);

    return { periods, currentPeriod };
  }

  @Loading(LoaderType.PRICING)
  async ngOnInit(): Promise<void> {
    const { periods, currentPeriod } = await this.preparePeriods();

    this.periods = periods;
    this.selectedPeriodId = currentPeriod ? currentPeriod.id : null;
  }

}
