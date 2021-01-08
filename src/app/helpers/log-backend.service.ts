import { Injectable, OnDestroy } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { map } from 'rxjs/operators';

import { UserService } from '../auth/user.service';
import { LogBackendInit, LogBackendLogout } from './api/api-logger.models';
import { ApiLoggerService } from './api/api-logger.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class LogBackendService implements OnDestroy {
  private aliveSignalInterval: number;
  private isInitialized = false;
  private sessionId: number;

  constructor(
    private apiLoggerService: ApiLoggerService,
    private cacheService: CacheService,
    private deviceDetectService: DeviceDetectorService,
    private userService: UserService,
  ) {
    this.listenToLogoutEvent();
  }

  public async init(): Promise<void> {
    if (this.isInitialized) {
      console.warn('The backend logger service is already initialized');
      return;
    }
    this.isInitialized = true;
    this.sessionId = await this.sendInitEvent();
    this.startAliveSignalTimer();
  }

  private async sendInitEvent(): Promise<number> {
    const {c_name, dbName, username} = await this.cacheService.getCompanyDetails();

    const logData: LogBackendInit = {
      be_browser: this.deviceDetectService.browser,
      be_dbName: dbName,
      be_eventDate: '',
      be_hotelName: c_name,
      be_id: 0,
      be_ip: '',
      be_isMobile: this.deviceDetectService.isMobile() ? 'true' : 'false',
      be_longDesc: username,
      be_operatingSystem: this.deviceDetectService.os,
      be_screenSize: screen.width + ' x ' + screen.height,
      be_shortDesc: 'INIT',
      eventType: 'BackEnd'
    };

    return this.apiLoggerService.logBackendInit(logData).pipe(
      map(response => (response && response.length > 0 ? response[0] : 0))
    ).toPromise();
  }

  private async sendLogoutEvent(): Promise<void> {
    const logData: LogBackendLogout = {
      be_dbName: '',
      be_eventDate: '',
      be_hotelName: '',
      be_id: this.sessionId,
      be_ip: '',
      be_longDesc: '',
      be_shortDesc: 'LogOut',
      eventType: 'BackEnd'
    };

    return this.apiLoggerService.logBackendLogout(logData).toPromise();
  }

  private startAliveSignalTimer(): void {
    this.aliveSignalInterval = setInterval(async () => {
      const {dbName} = await this.cacheService.getCompanyDetails();
      this.apiLoggerService.sendAliveSignal(this.sessionId, dbName).toPromise();
    }, aliveSignalDelay * 1000);
  }

  private listenToLogoutEvent(): void {
    this.userService.loggedIn$.pipe(untilDestroyed(this)).subscribe(loggedIn => !loggedIn && this.sendLogoutEvent());
  }

  ngOnDestroy(): void {
    if (this.aliveSignalInterval) {
      clearInterval(this.aliveSignalInterval);
    }
  }
}

const aliveSignalDelay = 900; // in seconds
