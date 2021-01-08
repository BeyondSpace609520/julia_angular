import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { ViewService } from '@/app/main/view/view.service';
import { focusRoomplan } from '@/app/main/window/content/calendar/calendar-html/focusRoomplan';
import { TableField, TableFieldType } from '@/app/main/window/shared/table/models';
import { getUrlFromPath } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Statistics } from '../../../content/channel-management/statistics/models';
import { EventBusService } from '../../../shared/event-bus';
import { ExportService } from '../../../shared/services/export.service';
import { sort } from '../../../shared/table/sort';
import { SortEvent } from '../../../shared/table/sortable.directive';
import { MoveToRoomplanEvent } from '../../calendar/calendar-html/events';
import { LoaderType } from './loader-types';
import { prepareGetParams, reduceStatistics } from './reduce';
import { StatisticsFilterData } from './statistics-filter/statistics-filter.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.pug',
  styleUrls: ['./statistics.component.sass']
})
export class StatisticsComponent implements OnInit {
  public expiryFilterOptions = [
    { label: 'BackEnd_WikiLanguage.validUntilSTAT_all', value: 'all' },
    { label: 'BackEnd_WikiLanguage.validUntilSTAT_expired', value: 'expired' },
    { label: 'BackEnd_WikiLanguage.validUntilSTAT_nonExpired', value: 'notExpired' },
  ];
  public fields: TableField[] = [
    {
      id: 'bookingNumber',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_Reservation',
      type: TableFieldType.Text,
      sortable: true,
      exportable: true,
    },
    {
      id: 'guestLastName',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_guestName',
      type: TableFieldType.Text,
      sortable: true,
      exportable: true,
    },
    {
      id: 'validUntil',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_validUntil',
      type: TableFieldType.Date,
      sortable: true,
      exportable: true,
    },
    {
      id: 'arrivalDate',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_fromDate',
      type: TableFieldType.Date,
      sortable: true,
      exportable: true,
    },
    {
      id: 'departureDate',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_untilDate',
      type: TableFieldType.Date,
      sortable: true,
      exportable: true,
    },
    {
      id: 'adults',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_adults',
      type: TableFieldType.Text,
      sortable: true,
      exportable: true,
    },
    {
      id: 'children',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_children',
      type: TableFieldType.Text,
      sortable: true,
      exportable: true,
    },
    {
      id: 'childrenAges',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_ages',
      type: TableFieldType.TextArray,
      sortable: true,
      exportable: true,
    },
    {
      id: 'amount',
      label: 'BackEnd_WikiLanguage.validUntilSTAT_amount',
      type: TableFieldType.NumericFormatted,
      sortable: true,
      exportable: true,
    }
  ];
  public lastSortEvent: SortEvent | null = defaultSortEvent;
  public pdfsLoading: number[] = [];
  public statistics: Statistics[] = [];
  public sortedItems: Statistics[] = [];
  public isLoading: Observable<boolean>;

  public TableFieldType = TableFieldType;

  private lastFilterData: StatisticsFilterData;

  constructor(
    private apiClient: ApiClient,
    private eventBus: EventBusService,
    private exportService: ExportService,
    private loaderService: LoaderService,
    private mainService: MainService,
    private viewService: ViewService,
  ) {
    this.isLoading = this.loaderService.isLoadingAnyOf([LoaderType.Search, LoaderType.Action]);
  }

  @Loading(LoaderType.Search)
  public async onFilter(data: StatisticsFilterData): Promise<void> {
    const params = prepareGetParams(data);

    const rawStatistics = await this.apiClient.getStatistics(params).toPromise();

    this.lastFilterData = data;

    this.statistics = rawStatistics.map(reduceStatistics);
    this.sort(null);
  }

  public onExportExcel(): void {
    this.exportService.asExcel(this.fields, this.sortedItems, 'validUntilStatistics');
  }

  public sort(rule: SortEvent | null): void {
    if (!rule) {
      rule = this.lastSortEvent || defaultSortEvent;
    }
    this.sortedItems = sort(this.statistics, rule);
    this.lastSortEvent = rule;
  }

  public trackStatistics(index, item: Statistics): number {
    return item.bookingId;
  }

  public updateList(): void {
    if (!this.lastFilterData) {
      this.lastFilterData = defaultFilterData;
    }
    this.onFilter(this.lastFilterData);
  }

  public async openBooking(item: Statistics): Promise<void> {
    await focusRoomplan(this.viewService);

    this.eventBus.emit<MoveToRoomplanEvent>('moveToRoomplan', {
      arrivalDate: item.arrivalDate,
      id: item.bookingId,
      type: item.bookingStatus
    });
  }

  public async downloadPdf(item: Statistics): Promise<void> {
    this.pdfsLoading.push(item.bookingId);
    const { dbName } = this.mainService.getCompanyDetails();
    const pdfUrl = await this.apiClient.getBookingPdf(item.bookingId, dbName).toPromise();
    this.pdfsLoading = this.pdfsLoading.filter(l => l !== item.bookingId);

    window.open(getUrlFromPath(pdfUrl), '_blank');
  }

  ngOnInit(): void {
    this.updateList();
  }
}

const defaultFilterData: StatisticsFilterData = {
  expiry: 'all'
};

const defaultSortEvent: SortEvent = {
  column: 'validUntil',
  direction: 'asc'
};
