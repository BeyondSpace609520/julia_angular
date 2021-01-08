import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { ModalOptions, ModalService } from 'easybooking-ui-kit/services/modal.service';

import { PricingTestConsoleComponent } from '@/ui-kit/components/modals/pricing-test-console/pricing-test-console.component';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { CompanyDetails } from '@/app/main/models';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { openCopyToModal } from '@/app/main/window/shared/copy-to/modal';
import { LoaderType } from '@/app/main/window/shared/pricing-settings/loader-type';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { SeasonPeriod } from '../../../../pricing-admin/season-periods/models';
import { RoomCategory } from '../../models';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-category-prices',
  templateUrl: './prices.component.pug',
  styleUrls: ['./prices.component.sass']
})
export class PricesComponent extends TabComponent implements OnInit, OnChanges {

  canSaveForAll = false;

  @Input() companyDetails!: CompanyDetails;
  @Output() saved = new EventEmitter<RoomCategory>();

  constructor(
    private apiClient: ApiClient,
    private mainService: MainService,
    public loaderService: LoaderService,
    private modal: ModalService,
    private ebDate: EbDatePipe,
  ) {
    super();
  }

  openTestingPriceConsole(period: SeasonPeriod) {
    const options: ModalOptions = {
      skipJulia: true,
      hidePrimaryButton: true,
      classes: ['pricing-test-console'],
    };
    const modalData = this.modal.openForms('Pricing Test Console', PricingTestConsoleComponent, options);
    modalData.modalBody.init(period, this.category.id).then(() => {
      if (modalData.modalBody.noRoomsInThisEntityGroup) {
        modalData.modal.buttonCancelLabel = 'BackEnd_WikiLanguage.generic_Ok' ;
      }
    });
  }

  @Loading(LoaderType.PRICING)
  async copyTo(period: SeasonPeriod): Promise<void> {
    const categories = await this.apiClient.getEntityGroupLight().toPromise();
    const periods = await this.apiClient.getSeasonPeriods().toPromise();
    const source = `${this.category.name}, ${period.name}`;
    const sections = [
      {
        label: 'BackEnd_WikiLanguage.CTD_Data',
        items: [
          { id: 'catering', label: 'BackEnd_WikiLanguage.CTD_Catering' },
          { id: 'prices', label: 'BackEnd_WikiLanguage.CTD_Prices' },
          { id: 'seasonProperties', label: 'BackEnd_WikiLanguage.CTD_SeasonProperties' },
          { id: 'cleanupCharge', label: 'BackEnd_WikiLanguage.CTD_CleanupCharge' }
        ]
      },
      {
        label: 'BackEnd_WikiLanguage.CTD_Category',
        items: categories.map(item => ({ id: item.id,  label: item.name }))
      },
      {
        label: 'BackEnd_WikiLanguage.CTD_SeasonPeriod',
        items: periods.map(item => ({
          id: item.id,
          label: item.name,
          tooltip: `${this.ebDate.transform(item.fromDate, false)} - ${this.ebDate.transform(item.untilDate, false)}`
        }))
      }
    ];

    const modal = openCopyToModal(this.modal);

    modal.init(source, sections, async ([information, categoryIds, periodIds]) => {
      await this.apiClient.copyRoomCategoryTo(period.id, this.category.id, information, categoryIds, periodIds).toPromise();
      this.saved.emit();
    });
  }

  ngOnChanges({companyDetails}: SimpleChanges): void {
    if (companyDetails) {
      const {c_hasAdvancedPricingModule, c_beRoomLevelPricingEnabled} = this.companyDetails;
      this.canSaveForAll = c_hasAdvancedPricingModule === 'on' && c_beRoomLevelPricingEnabled === 'on';
    }
  }
}
