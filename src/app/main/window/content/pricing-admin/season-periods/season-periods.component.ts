import { Component, OnDestroy, OnInit } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-type';
import { SeasonPeriod } from './models';
import { NewPeriodModalComponent } from './new-period-modal/new-period-modal.component';
import { findInconsecutivePeriod } from './utils';

@Component({
  selector: 'app-season-periods',
  templateUrl: './season-periods.component.pug',
  styleUrls: ['./season-periods.component.sass']
})
export class SeasonPeriodsComponent implements OnInit, OnDestroy {

  periods: SeasonPeriod[] = [];
  selectedPeriodId: number | null = null;
  brokenPeriod: SeasonPeriod | null = null;
  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private ebDate: EbDatePipe,
    private eventBusService: EventBusService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_PERIODS);
  }

  // TODO replace function with pipe or static variable
  getPeriodLabel(period: SeasonPeriod): string {
    const from = this.ebDate.transform(period.fromDate, false);
    const to = this.ebDate.transform(period.untilDate, false);

    return `${from} - ${to}, ${period.name}`;
  }

  @Loading(LoaderType.LOAD_PERIODS)
  async loadPeriods(): Promise<void> {
    this.periods = await this.apiClient.getSeasonPeriods().toPromise();
    this.checkErrors();
  }

  checkErrors(): void {
    this.brokenPeriod = findInconsecutivePeriod(this.periods);

    if (this.brokenPeriod) {
      this.modalService.openSimpleText('BackEnd_WikiLanguage.SP_AlertWarningMessageStart', this.getPeriodLabel(this.brokenPeriod), {
        ngbOptions: {
          size: 'sm'
        },
      });
    }
  }

  async processPeriods(periodId: number): Promise<void> {
    const period = this.periods.find(p => p.id === periodId);

    if (!period) {
      throw new Error('Period not fund');
    }

    const progress = new BehaviorSubject<number>(0);

    this.modalService.openProgress(
      'BackEnd_WikiLanguage.PP_Header',
      progress.pipe(untilDestroyed(this)),
      true
    );

    const roomsIds = await this.apiClient.getPeriodsEntityList().toPromise();
    let processed = 0;

    await Promise.all(roomsIds.map(async id => {
      await this.apiClient.setBookingCalendar(id, period).toPromise();
      processed++;
      progress.next(Math.ceil(processed / roomsIds.length * 100));
    }));
    progress.complete();
  }

  selectItem(item: SeasonPeriod): void {
    this.selectedPeriodId = item.id;
  }

  newPeriod(): void {
    const modalData = this.modalService.openForms('BackEnd_WikiLanguage.SP_NewSPHeader', NewPeriodModalComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert'
    });

    modalData.modalBody.init(this.periods);
    modalData.modal.save.subscribe(async () => {
      this.selectedPeriodId = await modalData.modalBody.submit();
      await this.loadPeriods(); // load new period
      this.processPeriods(this.selectedPeriodId);
      modalData.modal.close(true);
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    });
  }

  onPeriodEdited(selectedPeriodId: number): void {
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    this.loadPeriods();
    this.processPeriods(selectedPeriodId);
  }

  @Loading(LoaderType.LOAD_PERIODS)
  async deletePeriod(periodId: number): Promise<void> {
    // tslint:disable-next-line: max-line-length
    const confirmed = await this.modalService.openConfirm('BackEnd_WikiLanguage.SP_ConfirmDeleteSPEMessageHeader', 'BackEnd_WikiLanguage.SP_ConfirmDeleteSPEMessage');

    if (confirmed) {
      await this.apiClient.deleteSeasonPeriod(periodId).toPromise();
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
      await this.loadPeriods();
      this.selectedPeriodId = null;
    }
  }

  ngOnInit(): void {
    this.loadPeriods();
  }

  ngOnDestroy(): void {}
}
