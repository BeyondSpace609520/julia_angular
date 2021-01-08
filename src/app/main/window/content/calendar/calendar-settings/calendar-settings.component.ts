import { ModalService } from '@/ui-kit/services/modal.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
import { CalendarSettings, ICSEvent } from './models';

@Component({
  selector: 'app-calendar-settings',
  templateUrl: './calendar-settings.component.pug',
  styleUrls: ['./calendar-settings.component.sass']
})
export class CalendarSettingsComponent implements OnInit {

  public settings: CalendarSettings;
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private translate: TranslateService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.CALENDAR_SETTINGS);
  }

  public addNewItem(): void {
    this.settings.periodsColor.push({
      id: null,
      name: 'Period name',
      fromDate: new Date(),
      untilDate: new Date(),
      color: '#ffffff',
      _tempId: Math.floor(Math.random() * 10000)
    });
  }

  public async onICSImport(): Promise<void> {
    const file  = await selectFileDialog('text/calendar');
    let incorrectLines = 0;
    if (!file) { return; }
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      if (reader.result) {
        const events = parseICSData((reader.result).toString());
        if (events) {
          events.forEach(event => {
            if (event.startDate && event.endDate) {
              let periodName = '';
              if (event.summary) {
                periodName = event.summary;
              }
              if (periodName === '' && event.description) {
                periodName = event.description;
              }
              this.settings.periodsColor.push({
                id: null,
                name: periodName,
                fromDate: event.startDate,
                untilDate: event.endDate,
                color: '#ffffff',
                _tempId: Math.floor(Math.random() * 10000)
              });
            } else {
              incorrectLines++;
            }
          });
        }
      }
      if (incorrectLines > 0) {
        this.translate.get('BackEnd_WikiLanguage.icsImportIncorrectLines', {incorrectLines}).subscribe((modalTitle) => {
          this.modalService.openSimpleText(modalTitle);
        });
      }
    };
  }

  public deleteItem(period: CalendarSettings['periodsColor'][0]): void {
    const { periodsColor } = this.settings;
    periodsColor.splice(periodsColor.indexOf(period), 1);
  }

  @Loading(LoaderType.CALENDAR_SETTINGS)
  public async save(): Promise<void> {
    await this.apiClient.saveCalendarSettings(this.settings).toPromise();
    this.settings = await this.apiClient.getCalendarSettings().toPromise();
  }

  @Loading(LoaderType.CALENDAR_SETTINGS)
  async ngOnInit() {
    this.settings = await this.apiClient.getCalendarSettings().toPromise();
  }
}

function parseICSData(icsData: string): ICSEvent[] {
  const NEW_LINE = /\r\n|\n|\r/;
  const EVENT = 'VEVENT';
  const EVENT_START = 'BEGIN';
  const EVENT_END = 'END';
  const START_DATE = 'DTSTART';
  const END_DATE = 'DTEND';
  const DESCRIPTION = 'DESCRIPTION';
  const SUMMARY = 'SUMMARY';
  const LOCATION = 'LOCATION';
  const ALARM = 'VALARM';

  const keyMap = {
    [START_DATE]: 'startDate',
    [END_DATE]: 'endDate',
    [DESCRIPTION]: 'description',
    [SUMMARY]: 'summary',
    [LOCATION]: 'location'
  };

  const events: any[] = [];
  let currentObj: ICSEvent = {};
  let lastKey = '';
  const lines = icsData.split(NEW_LINE);
  let isAlarm = false;

  for (let i = 0, iLen = lines.length; i < iLen; ++i) {
    const line = lines[i];
    const lineData = line.split(':');

    let key = lineData[0];
    const value = lineData[1];

    if (key.indexOf(';') !== -1) {
      const keyParts = key.split(';');
      key = keyParts[0]; // Maybe do something with that second part later
    }

    if (lineData.length < 2) {
      if (key.startsWith(' ') && lastKey !== undefined && lastKey.length) {
        currentObj[lastKey] += clean(line.substr(1));
      }
      continue;
    } else {
      lastKey = keyMap[key];
    }

    switch (key) {
      case EVENT_START:
        if (value === EVENT) {
          currentObj = {};
        } else if (value === ALARM) {
          isAlarm = true;
        }
        break;
      case EVENT_END:
        isAlarm = false;
        if (value === EVENT) {
          events.push(currentObj);
        }
        break;
      case START_DATE:
        currentObj[keyMap[START_DATE]] = parseICalDate(value);
        break;
      case END_DATE:
        currentObj[keyMap[END_DATE]] = parseICalDate(value);
        break;
      case DESCRIPTION:
        if (!isAlarm) {
          currentObj[keyMap[DESCRIPTION]] = clean(value);
        }
        break;
      case SUMMARY:
        currentObj[keyMap[SUMMARY]] = clean(value);
        break;
      case LOCATION:
        currentObj[keyMap[LOCATION]] = clean(value);
        break;
    }
  }
  return events;
}

/**
 * Parser is required because the date is not always in a valid format
 * iCalStr e.g. '20110914T184000Z' but it can be '20110914'
 */
function parseICalDate(iCalStr: string): Date {
  const strYear = +iCalStr.substr(0, 4);
  const strMonth = parseInt(iCalStr.substr(4, 2), 10) - 1;
  const strDay = +iCalStr.substr(6, 2);
  const strHour = +iCalStr.substr(9, 2);
  const strMin = +iCalStr.substr(11, 2);
  const strSec = +iCalStr.substr(13, 2);
  return new Date(strYear, strMonth, strDay, strHour, strMin, strSec);
}

function clean(text: string): string {
  return unescape(text).trim();
}
