import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Observable } from 'rxjs';

import { CacheService } from '@/app/helpers/cache.service';
import { WindowsService } from '@/app/main/window/windows.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

import { ApiCompanyService } from '../../../../../helpers/api/api-company.service';

import { Window } from '../../../models';
import { LoaderType } from './loader-type';

@Component({
  selector: 'app-season-periods-settings',
  templateUrl: './season-periods-settings.component.pug',
  styleUrls: ['./season-periods-settings.component.sass'],
})
export class SeasonPeriodsSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('blockArrivalDate', { static: false })
  blockArrivalDate!: ElementRef;
  @ViewChild('blockDepartureDate', { static: false })
  blockDepartureDate!: ElementRef;

  @Input() window!: Window;

  public blockArrivalDates: string[] = [];
  public blockDepartureDates: string[] = [];

  public today = new Date();

  public isLoading: Observable<boolean>;

  public selectedblockArrivalDate: string | null = null;
  public selectedblockDepartureDate: string | null = null;
  public selectedblockArrivalDateId: number | null = null;
  public selectedblockDepartureDateId: number | null = null;

  constructor(
    private cacheService: CacheService,
    private loaderService: LoaderService,
    private companyService: ApiCompanyService,
    private windowsService: WindowsService // private translate: TranslateService, // private ebDate: EbDatePipe
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_SETTINGS);
  }

  public addBlockArrivalDate(date: string): void {
    this.blockArrivalDates.push(date);
    this.blockArrivalDates = [...new Set(this.blockArrivalDates)];
  }
  public addBlockDepartureDate(date: string): void {
    this.blockDepartureDates.push(date);
    this.blockDepartureDates = [...new Set(this.blockDepartureDates)];
  }

  public removeBlockArrivalDate(date: string | null): void {
    this.blockArrivalDates = this.blockArrivalDates.filter(
      (item) => item !== date
    );
  }

  public removeBlockDepartureDate(date: string | null): void {
    this.blockDepartureDates = this.blockDepartureDates.filter(
      (item) => item !== date
    );
  }

  public selectBlockArrivalDate(date: string) {
    this.selectedblockArrivalDate = date;

    this.selectedblockArrivalDateId = this.blockArrivalDates.findIndex(
      (item) => item === date
    );
  }
  public selectBlockDepartureDate(date: string) {
    this.selectedblockDepartureDate = date;

    this.selectedblockDepartureDateId = this.blockDepartureDates.findIndex(
      (item) => item === date
    );
  }

  @Loading(LoaderType.LOAD_SETTINGS)
  public async save(): Promise<void> {
    await this.companyService
      .setGeneralSettings({
        blockArrival: this.blockArrivalDates,
        blockDeparture: this.blockDepartureDates,
      })
      .toPromise();
    await this.initData(true);
  }

  public cancel() {
    return this.windowsService.closeWindow(this.window);
  }

  private async initData(force: boolean = false): Promise<void> {
    const blockDates = await this.cacheService.getBlockedDates(force);
    this.blockArrivalDates = blockDates.blockArrival || [];
    this.blockDepartureDates = blockDates.blockDeparture || [];
  }

  @Loading(LoaderType.LOAD_SETTINGS)
  async ngOnInit(): Promise<void> {
    await this.initData();
  }

  ngOnDestroy(): void {
  }
}
