import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { CacheService } from '@/app/helpers/cache.service';
import { ServiceState } from '@/app/helpers/models';
import { HotelRegistrationRecord } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { Window } from '@/app/main/window/models';
import { LoaderService } from '@/app/shared/loader.service';
import { TabsSettings } from '@/ui-kit/components/tabs/tabs.models';
import { Providers } from '../create-registration-form/consts';
import { GuestRegistrationConfigService } from './guest-registration-config.service';
import { LoaderType } from './loader-types';
import { ReportingClientProvider } from './models';

@Component({
  selector: 'app-guest-registration-config',
  templateUrl: './guest-registration-config.component.pug',
  styleUrls: ['./guest-registration-config.component.sass']
})
export class GuestRegistrationConfigComponent implements OnInit, OnDestroy {
  @Input() window!: Window;
  @Output() hotelsReordered = new EventEmitter();
  @Output() windowTitleChange = new EventEmitter<string>();

  activeTabId: 'company' | 'numberRanges' | 'guestTypes' = 'company';
  isLoading: Observable<boolean>;
  tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'company',
        label: 'BackEnd_WikiLanguage.MW_GeneralSettingsTAB',
      },
      {
        id: 'numberRanges',
        label: 'BackEnd_WikiLanguage.MW_NumberRangesTAB',
      },
      {
        id: 'guestTypes',
        label: 'BackEnd_WikiLanguage.MW_GuestTypesTAB',
      }
    ],
    buttonClasses: ['nav-link']
  };

  private init = new Subject();
  private translationFor: string;
  private windowBaseTitle: string;

  constructor(
    public guestRegistrationConfigService: GuestRegistrationConfigService,
    private loaderService: LoaderService,
    private cacheService: CacheService,
    private translate: TranslateService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.Load);
    this.guestRegistrationConfigService.selectedHotel.pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(selectedHotel => {
      this.updateWindowTitle(selectedHotel);
    });
    this.guestRegistrationConfigService.selectedProvider.pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(selectedProvider => {
      this.showOrHideTabs(selectedProvider);
    });
  }

  async hotelUpdated(): Promise<void> {
    await this.guestRegistrationConfigService.loadHotels(true);
    if (!this.guestRegistrationConfigService.selectedHotel) {
      return;
    }
    const selectedHotel = this.guestRegistrationConfigService.getSelectedHotel();
    this.selectHotelById(selectedHotel ? selectedHotel.id : null);
  }

  private selectHotelById(hotelId: number | null) {
    if (!hotelId) {
      return;
    }
    const hotel = this.guestRegistrationConfigService.hotels.find(h => h.id === hotelId);
    if (hotel) {
      this.guestRegistrationConfigService.selectHotel(hotel);
    }
  }

  private async updateWindowTitle(selectedHotel: HotelRegistrationRecord | null): Promise<void> {
    if (!selectedHotel) {
      this.windowTitleChange.emit(this.windowBaseTitle);
    } else {
      this.windowTitleChange.emit(`${this.windowBaseTitle} ${this.translationFor} ${selectedHotel.name}`);
    }
  }

  private showOrHideTabs(selectedProvider: ReportingClientProvider | null) {
    if (selectedProvider && selectedProvider.id === Providers.AVS) {
      this.tabSettings.buttons.forEach(tabButton => {
        tabButton.hidden = tabButton.id !== 'company';
      });
    } else {
      this.tabSettings.buttons.forEach(tabButton => {
        tabButton.hidden = false;
      });
    }
  }

  ngOnInit(): void {
    this.guestRegistrationConfigService.state$.pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(async state => {
      if (state === ServiceState.Ready) {
        this.translationFor = await this.translate.get('BackEnd_WikiLanguage.generic_For').toPromise();
        this.windowBaseTitle = await this.translate.get(this.window.title).toPromise();
        this.init.next();
        this.init.complete();
        this.guestRegistrationConfigService.loadHotels();
      }
    });
  }

  ngOnDestroy(): void {}
}
