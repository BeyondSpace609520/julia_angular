import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { SpecialOffer } from '../models';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.pug',
  styleUrls: ['./tabs-container.component.sass']
})
export class TabsContainerComponent {

  @Input() offer!: SpecialOffer;
  @Output() tabSaved = new EventEmitter<string>();

  public activeTabId = 'main';
  public isLoading: Observable<boolean>;
  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'main',
        label: 'BackEnd_WikiLanguage.SO_TABConfig'
      },
      {
        id: 'pricing',
        label: 'BackEnd_WikiLanguage.SO_TABPricing'
      },
      {
        id: 'period',
        label: 'BackEnd_WikiLanguage.SO_TABPeriodPricing'
      }
    ]
  };

  constructor(
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_TAB);
  }

  onTabSaved(): void {
    this.tabSaved.emit(this.activeTabId);
  }
}
