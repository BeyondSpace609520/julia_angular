import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { CacheService } from '@/app/helpers/cache.service';
import { ViewService } from '@/app/main/view/view.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { DateRange } from '@/ui-kit/models';
import { EventBusService } from '../../../shared/event-bus';
import { isDateRangeValid, normalizeDateRange } from '../../../shared/forms/utils';
import { HotelsUpdatedEvent } from '../guest-registration-config/events';
import { RefreshRegistrationForms } from './events';
import { LoaderType } from './loader-types';
import { HotelRegistrationRecord, RegistrationType, ViewMode } from './models';
import { Tab, TabInformation } from './tabs/tab';

@Component({
  selector: 'app-guest-registration',
  templateUrl: './guest-registration.component.pug',
  styleUrls: ['./guest-registration.component.sass']
})
export class GuestRegistrationComponent implements OnInit, OnDestroy, OnChanges {

  @Input() top: boolean;
  @Input() range?: DateRange;
  @Input() lastName?: string;
  @Input() status?: string;
  @Input() activeTabId: ViewMode;

  ViewMode = ViewMode;
  tabSettings: TabsSettings = {
    buttons: [
      {
        id: ViewMode.OVERVIEW,
        label: 'BackEnd_WikiLanguage.MW_OverviewTAB'
      },
      {
        id: ViewMode.IN_PREPARATION,
        label: 'BackEnd_WikiLanguage.MW_PrepareTAB'
      },
      {
        id: ViewMode.ARRIVED,
        label: 'BackEnd_WikiLanguage.MW_ArrivedTAB'
      },
      {
        id: ViewMode.DEPARTED,
        label: 'BackEnd_WikiLanguage.MW_DeparturedTAB'
      }
    ],
    buttonClasses: ['nav-link']
  };

  public form: FormGroup;
  public hotelRecords: HotelRegistrationRecord[] = [];
  public registrationTypes: RegistrationType[] = [];

  public printRegForm = printRegForm;

  public isLoading: Observable<boolean>;

  public selectedHotelId: number;

  private focused = new Subject<boolean>();

  @ViewChild('tabComponent', { static: false }) tabComponent: Tab;

  constructor(
    private cacheService: CacheService,
    private loaderService: LoaderService,
    private eventBus: EventBusService,
    private cd: ChangeDetectorRef,
    private viewService: ViewService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.eventBus.on<RefreshRegistrationForms>('refreshRegistrationForms').pipe(untilDestroyed(this)).subscribe(() => {
      this.search();
    });
    this.eventBus.on<HotelsUpdatedEvent>('hotelsUpdated').pipe(untilDestroyed(this)).subscribe(() => {
      this.updateHotels();
    });
    this.focused.asObservable().pipe(untilDestroyed(this), distinctUntilChanged()).subscribe(focused => {
      if (focused) {
        this.update();
      }
    });
  }

  public selectTab(id: string): void {
    this.activeTabId = id as ViewMode;
  }

  public onDateChange(dateField: string, value: Date): void {
    const control = this.form.get(dateField) as FormControl;
    if (control) {
      control.markAsTouched();
      control.setValue(value);
    }
  }

  public onTabLoad(data: TabInformation): void {
    const fromDate = this.form.get('fromDate') as FormControl;
    const untilDate = this.form.get('untilDate') as FormControl;
    const name = this.form.get('name') as FormControl;
    const status = this.form.get('status') as FormControl;

    if (this.range && isDateRangeValid(this.range)) {
      fromDate.setValue(this.range.start);
      untilDate.setValue(this.range.end);
    } else if (!fromDate.touched && !untilDate.touched) {
      fromDate.setValue(data.from);
      untilDate.setValue(data.until);
    }
    this.range = undefined;

    if (this.lastName) {
      name.setValue(this.lastName);
    }
    this.lastName = undefined;

    if (this.status) {
      status.setValue(this.status);
    }
    this.status = undefined;

    this.cd.detectChanges();
    this.search();
  }

  public search(): void {
    const { name, fromDate, untilDate, status, hotel, numberFrom, numberTo, type } = this.form.getRawValue();
    // store selected hotel id for opening dialog later on
    this.selectedHotelId = hotel;
    this.tabComponent.search({ name, fromDate, untilDate, status, hotel, from: +numberFrom, until: +numberTo, type: +type });
  }

  private async initData(): Promise<void> {
    [this.hotelRecords, this.registrationTypes] = await Promise.all([
      this.cacheService.getGuestRegistrationHotels(),
      this.cacheService.getGuestRegistrationTypes()
    ]);
  }

  @Loading(LoaderType.LOAD)
  private async updateHotels(): Promise<void> {
    this.hotelRecords = await this.cacheService.getGuestRegistrationHotels(true);
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      fromDate: new FormControl(),
      untilDate: new FormControl(),
      status: new FormControl('all'),
      type: new FormControl('all'),
      numberFrom: new FormControl(0),
      numberTo: new FormControl(0),
      hotel: new FormControl(this.hotelRecords[0] ? this.hotelRecords[0].id : 0),
    });
    normalizeDateRange(this.form.get('fromDate') as FormControl, this.form.get('untilDate') as FormControl, untilDestroyed(this));
  }

  private async update(): Promise<void> {
    await this.updateHotels();
    await this.search();
  }

  @Loading(LoaderType.LOAD)
  async ngOnInit(): Promise<void> {
    await this.initData();
    this.initForm();
    if (!this.activeTabId) {
      this.selectTab(ViewMode.OVERVIEW);
    }
  }

  ngOnDestroy(): void {}

  ngOnChanges({top}: SimpleChanges): void {
    if (top && top.previousValue !== undefined) {
      this.focused.next(top.currentValue);
    }
  }
}

function printRegForm(): void {
  window.open(environment.remoteUrl + '/wo/Services/com/eBook/registrationForm/blanko.php', '_blank');
}
