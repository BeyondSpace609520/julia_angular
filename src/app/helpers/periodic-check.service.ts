import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

import qs from 'query-string';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppVersion } from '@/app/helpers/models';
import { ModalService } from '@/ui-kit/services/modal.service';
import { ApiMessageCenterService } from './api/api-message-center.service';

@Injectable({
  providedIn: 'root',
})
export class PeriodicCheckService implements OnDestroy {
  // public messageCenterCount: number | undefined;

  private messageCenterCount = new BehaviorSubject<number | undefined>(undefined);
  public messageCenterCount$: Observable<number | undefined> = this.messageCenterCount.asObservable();

  private currentVersion: AppVersion | undefined;

  private versionCheckTimer: ReturnType<typeof setTimeout>;
  private messageCenterTimer: ReturnType<typeof setTimeout>;

  constructor(
    private apiMessageCenterService: ApiMessageCenterService,
    private modalService: ModalService,
    private httpClient: HttpClient
  ) {}

  async checkIfThereAreNewMessages(): Promise<void> {
    this.messageCenterCount.next(await this.checkMessageCenterCount());
  }

  async init(): Promise<AppVersion | undefined> {
    this.currentVersion = await this.checkVersion();
    this.messageCenterCount.next(await this.checkMessageCenterCount());
    this.startVersionCheckTimeout();
    return this.currentVersion;
  }

  private async checkIfThereIsNewerVersion(): Promise<void> {
    const newVersion = await this.checkVersion();
    if (!newVersion) {
      return;
    }
    const needsUpdate = this.compareVersionWithCurrent(newVersion);
    if (needsUpdate) {
      if (await this.getRefreshConfirmation()) {
        reloadWithNewVersion(newVersion.version);
        return;
      }
    }
    this.startVersionCheckTimeout();
  }

  private async checkVersion(): Promise<AppVersion | undefined> {
    const versionUrl = 'version.json?t=' + Date.now();
    try {
      return await this.httpClient
        .get<AppVersion>(versionUrl)
        .pipe(
          catchError((error) => {
            return throwError('Version number can not be retrieved');
          })
        )
        .toPromise();
    } catch (e) {
      return undefined;
    }
  }

  private async checkMessageCenterCount(): Promise<number | undefined> {
    try {
      return await this.apiMessageCenterService.getMessageCenterCount().toPromise();
    } catch (e) {
      return undefined;
    }
  }

  private compareVersionWithCurrent(version: AppVersion): boolean {
    if (this.currentVersion === undefined) {
      this.currentVersion = version;
      return false;
    } else if (this.currentVersion.version !== version.version) {
      return true;
    }
    return false;
  }

  private async getRefreshConfirmation(): Promise<boolean> {
    return await this.modalService.openConfirm(
      'BackEnd_WikiLanguage.newReleaseAvailableTitle',
      'BackEnd_WikiLanguage.newReleaseAvailable',
      {
        primaryButtonLabel: 'BackEnd_WikiLanguage.generic_RefreshNow',
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_RefreshLater',
        autoConfirmTimeout: 30,
        disableClose: true,
      }
    );
  }

  private startVersionCheckTimeout(): void {
    this.versionCheckTimer = setTimeout(() => {
      this.checkIfThereIsNewerVersion();
    }, versionCheckDelay * 1000);
  }

  ngOnDestroy(): void {
    if (this.versionCheckTimer) {
      clearTimeout(this.versionCheckTimer);
    }
    if (this.messageCenterTimer) {
      clearTimeout(this.messageCenterTimer);
    }
  }
}

// in seconds
const versionCheckDelay = 600;

function reloadWithNewVersion(version: string): void {
  const parameters = qs.parse(location.search);
  parameters.v = version;
  const newParametersStr = qs.stringify(parameters);
  location.href = `${location.origin}${location.pathname}?${newParametersStr}${location.hash}`;
}
