import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ApiClient } from '@/app/helpers/api-client';
import { ViewService } from '@/app/main/view/view.service';
import { focusRoomplan } from '@/app/main/window/content/calendar/calendar-html/focusRoomplan';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { MoveToRoomplanEvent } from '../../../../calendar/calendar-html/events';
import { openGuestInformation } from '../../../guest-information/utils';
import { downloadAsCSV } from '../../exporters/csv';
import { downloadAsExcel } from '../../exporters/xls';
import { LoaderType } from '../../loader-types';
import { GuestRegistrationForm, GuestRegistrationItem, HotelRegistrationRecord, TableField, ViewMode } from '../../models';
import { SearchData, Tab } from '../tab';
import { getExportedFileName, openRegForm } from '../utils';

@Component({
  selector: 'app-overview-tab',
  templateUrl: './overview.component.pug',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent extends Tab implements OnInit, OnChanges {
  @Input() hotel!: HotelRegistrationRecord;

  public fields: TableField<GuestRegistrationItem>[] = [
    { name: 'arrival', label: 'BackEnd_WikiLanguage.BW_Arrival', type: 'date' },
    { name: 'lastName', label: 'BackEnd_WikiLanguage.MW_registered' },
    { name: 'rooms', label: 'BackEnd_WikiLanguage.MW_Room' },
    { name: 'nights', label: 'BackEnd_WikiLanguage.MW_Nights' },
    { name: 'persons', label: 'BackEnd_WikiLanguage.MW_Persons' },
    { name: 'registered', label: 'BackEnd_WikiLanguage.MW_registered' },
    { name: 'checkout', label: 'BackEnd_WikiLanguage.MW_deRegistered' },
  ];
  public items: GuestRegistrationItem[];

  constructor(
    private eventBus: EventBusService,
    private translate: TranslateService,
    private apiClient: ApiClient,
    public loaderService: LoaderService,
    private modalService: ModalService,
    private viewService: ViewService,
  ) {
    super();
  }

  public editGuest(item: GuestRegistrationItem): void {
    openGuestInformation(this.viewService, { bookingId: item.bookingId });
  }

  public async openBooking(item: GuestRegistrationItem): Promise<void> {
    await focusRoomplan(this.viewService);

    this.eventBus.emit<MoveToRoomplanEvent>('moveToRoomplan', {
      arrivalDate: item.arrival,
      id: item.bookingId,
      type: item.name
    });
  }

  public async exportCSV(): Promise<void> {
    const fields = await this.getExportFields();
    const fileName = await getExportedFileName(ViewMode.OVERVIEW, this.translate);
    downloadAsCSV(fields, this.items, fileName); // TODO sorted items
  }

  public async exportExcel(): Promise<void> {
    const fields = await this.getExportFields();
    const fileName = await getExportedFileName(ViewMode.OVERVIEW, this.translate);
    downloadAsExcel(fields, this.items, fileName); // TODO sorted items
  }

  @Loading(LoaderType.LOAD)
  public async search(data: SearchData) {
    this.items = await this.apiClient.getGuestRegistrationList(data).toPromise();
  }

  public openRegForm(item: GuestRegistrationItem, registrationForm?: GuestRegistrationForm, additionalMessage?: string) {
    openRegForm(this.viewService, this.hotel, item.bookingId, registrationForm && registrationForm.id);
    if (additionalMessage) {
      setTimeout(() => {
        this.modalService.openSimpleText(additionalMessage);
      }, 1000);
    }
  }

  private async getExportFields(): Promise<{[key in keyof GuestRegistrationItem]?: string}> {
    const translations = await this.translate.get(this.fields.map(field => field.label)).toPromise();
    return this.fields.reduce((fieldTranslations, field) => {
      fieldTranslations[field.name] = translations[field.label];
      return fieldTranslations;
    }, {});
  }

  ngOnInit() {
    const current = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.tabLoad.emit({ from: yesterday, until: current });
  }

  ngOnChanges({ items }: SimpleChanges) {
    if (items && items.currentValue !== items.previousValue) {
    }
  }
}
