import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CacheService } from '@/app/helpers/cache.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { TabsSettings } from '@/ui-kit/components/tabs/tabs.models';
import { LoaderType } from './loader-types';
import { EnquiryPoolTabId } from './models';

const tabs: {[key in EnquiryPoolTabId]: string} = {
  statistics: 'BackEnd_WikiLanguage.EQP_statisticsTABTitle',
  ebEnquiryPool: 'BackEnd_WikiLanguage.EQP_ebTABTitle',
  desklineEnquiryPool: 'BackEnd_WikiLanguage.EQP_feratelTABTitle',
  desklineEnquiryPoolActivation: 'BackEnd_WikiLanguage.EQP_feratelTABTitle'
};

@Component({
  selector: 'app-enquiry-pool',
  templateUrl: './enquiry-pool.component.pug',
  styleUrls: ['./enquiry-pool.component.sass']
})
export class EnquiryPoolComponent implements OnInit {

  @Input() activeTabId: EnquiryPoolTabId | null = null;
  @Input() fromDate?: Date;
  @Input() untilDate?: Date;

  tabsSettings?: TabsSettings;
  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private cacheService: CacheService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.DATA);
  }

  async activateDesklinePool(active: boolean): Promise<void> {
    await this.setupTabs(false, true, active, active ? 'desklineEnquiryPool' : 'desklineEnquiryPoolActivation');
    this.cacheService.getCompanyDetails(true);
  }

  @Loading(LoaderType.DATA)
  private async setupTabs(
    forceLoadData?: boolean,
    hasFeratelEnquiryPool?: boolean,
    desklinePoolActivated?: boolean,
    openTab?: EnquiryPoolTabId,
  ): Promise<void> {
    if (forceLoadData || hasFeratelEnquiryPool === undefined || desklinePoolActivated === undefined) {
      const {c_hasFeratelEnquiryPool, desklinePoolReactivated} = await this.cacheService.getCompanyDetails(forceLoadData);
      if (forceLoadData || hasFeratelEnquiryPool === undefined) {
        hasFeratelEnquiryPool = c_hasFeratelEnquiryPool === 'on';
      }
      if (forceLoadData || desklinePoolActivated === undefined) {
        desklinePoolActivated = desklinePoolReactivated === 'on';
      }
    }
    this.tabsSettings = createTabsSettings(hasFeratelEnquiryPool, desklinePoolActivated);
    this.activeTabId = this.getNewTabId(openTab);
  }

  private getNewTabId(preferredTab?: EnquiryPoolTabId): EnquiryPoolTabId | null {
    if (this.hasTab(preferredTab)) {
      return preferredTab || null;
    }
    if (!this.hasTab(this.activeTabId)) {
      return this.tabsSettings && this.tabsSettings.buttons.length > 0 ? this.tabsSettings.buttons[0].id as EnquiryPoolTabId : null;
    }
    return this.activeTabId;
  }

  private hasTab(searchTabId?: EnquiryPoolTabId | null): boolean {
    if (!searchTabId || !this.tabsSettings) {
      return false;
    }
    return !!this.tabsSettings.buttons.find(tab => tab.id === searchTabId);
  }

  ngOnInit(): void {
    this.setupTabs();
  }
}


function createTabsSettings(hasFeratelEnquiryPool: boolean, desklinePoolReactivated: boolean): TabsSettings {
  return {
    buttons: Object.keys(tabs).filter((tab: EnquiryPoolTabId) => {
      if (!tabs.hasOwnProperty(tab)) {
        return false;
      }
      switch (tab) {
        case 'statistics':
          return desklinePoolReactivated;
        case 'desklineEnquiryPool':
          return hasFeratelEnquiryPool && desklinePoolReactivated;
        case 'desklineEnquiryPoolActivation':
          return hasFeratelEnquiryPool && !desklinePoolReactivated;
        default:
          return true;
      }
    }).map(tab => ({
      id: tab,
      label: tabs[tab]
    })),
  };
}
