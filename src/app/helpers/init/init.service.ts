import { Injectable, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService, saveToken } from '@/app/auth/auth.service';
import { ServiceState } from '@/app/helpers/models';
import { getNumericParam, getParam, redirectToCustomer, redirectToLogin } from '@/app/helpers/static.functions';
import { LanguageService } from '@/app/i18n/language.service';

@Injectable({
  providedIn: 'root'
})
export class InitService implements OnDestroy {
  private loaded = new BehaviorSubject<boolean>(false);
  public loaded$ = this.loaded.asObservable();

  constructor(
    private authService: AuthService,
    private languageService: LanguageService
  ) {
    if (!cleanUpParameters()) {
      return;
    }
    this.authService.init();
    const authServiceReady: Observable<boolean> = this.authService.state$.pipe(
      untilDestroyed(this),
      map(state => state === ServiceState.Ready)
    );
    const languageServiceReady: Observable<boolean> = this.languageService.state$.pipe(
      untilDestroyed(this),
      map(state => state === ServiceState.Ready)
    );
    combineLatest(authServiceReady, languageServiceReady).subscribe(states => {
      if (states.every(value => value)) {
        this.loaded.next(true);
      }
    });
  }

  ngOnDestroy(): void {}
}

function cleanUpParameters(): boolean {
  const customerId = getNumericParam('customer');
  const accessToken = getParam('token');
  const rememberMe = getParam('rememberMe');
  const legacyCustomerId = getNumericParam('c_id');
  const legacyLanguageId = getNumericParam('l_id');
  const legacyVersionNumber = getParam('v');
  const needsRedirect = [accessToken, legacyCustomerId, legacyLanguageId, legacyVersionNumber].some(value => value !== undefined);
  if (accessToken) {
    saveToken(accessToken, rememberMe === '1');
  }
  if (needsRedirect) {
    const actualCustomerId = customerId ? customerId : legacyCustomerId;
    if (!actualCustomerId) {
      redirectToLogin();
      return true;
    }
    redirectToCustomer(actualCustomerId);
  }
  return !needsRedirect;
}
