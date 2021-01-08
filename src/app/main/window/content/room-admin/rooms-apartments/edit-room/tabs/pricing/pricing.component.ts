import { Component } from '@angular/core';

import { ModalOptions, ModalService } from 'easybooking-ui-kit/services/modal.service';

import { PricingTestConsoleComponent } from '@/ui-kit/components/modals/pricing-test-console/pricing-test-console.component';

import { ApiClient } from '@/app/helpers/api-client';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SeasonPeriod } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { openCopyToModal } from '@/app/main/window/shared/copy-to/modal';
import { LoaderType } from '@/app/main/window/shared/pricing-settings/loader-type';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { RoomListItem } from '../../../models';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.pug',
  styleUrls: ['./pricing.component.sass']
})
export class PricingComponent extends TabComponent {

  constructor(
    public loaderService: LoaderService,
    private apiClient: ApiClient,
    private ebDate: EbDatePipe,
    private modal: ModalService
  ) {
    super();
  }

  init(item: RoomListItem) {
  }

  openTestingPriceConsole(period: SeasonPeriod) {
    if (!this.item) {
      return;
    }
    const options: ModalOptions = {
      skipJulia: true,
      hidePrimaryButton: true,
      classes: ['pricing-test-console'],
    };
    const modalData = this.modal.openForms('Pricing Test Console', PricingTestConsoleComponent, options);
    modalData.modalBody.init(period, undefined, this.item.id).then(() => {
      if (modalData.modalBody.noRoomsInThisEntityGroup) {
        modalData.modal.buttonCancelLabel = 'BackEnd_WikiLanguage.generic_Ok' ;
      }
    });
  }

  @Loading(LoaderType.PRICING)
  async resetApartment(seasonPeriod: SeasonPeriod) {
    await this.apiClient.resetApartment(this.item.id, seasonPeriod.id).toPromise();
  }

  @Loading(LoaderType.PRICING)
  async copyTo(period: SeasonPeriod) {
    const rooms = await this.apiClient.getActiveRooms().toPromise();
    const periods = await this.apiClient.getSeasonPeriods().toPromise();
    const source = `${this.item.uniqueNo}, ${period.name}`;
    const sections = [
      {
        label: 'BackEnd_WikiLanguage.CTD_Data',
        items: [
          { id: 'prices', label: 'BackEnd_WikiLanguage.CTD_Prices' },
          { id: 'seasonProperties', label: 'BackEnd_WikiLanguage.CTD_SeasonProperties' },
          { id: 'cleanupCharge', label: 'BackEnd_WikiLanguage.CTD_CleanupCharge' }
        ]
      },
      {
        label: 'BackEnd_WikiLanguage.CTD_Rooms',
        items: rooms.map(item => ({ id: item.id,  label: item.name }))
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

    modal.init(source, sections, async ([information, roomIds, periodIds]) => {
      await this.apiClient.copyRoomTo(period.id, this.item.id, information, roomIds, periodIds).toPromise();
    });
  }
}
