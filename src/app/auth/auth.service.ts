import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ApiAuthService } from '../helpers/api/api-auth.service';
import { ServiceState } from '../helpers/models';
import { redirectToLogin } from '../helpers/static.functions';
import { LanguageService } from '../i18n/language.service';
import { AuthenticationResult } from './models';
import { reduceRawAuthenticationResult } from './reduce';
import { UserService } from './user.service';

const checkAuthTimeout = 60; // in seconds

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private state = new BehaviorSubject<ServiceState>(ServiceState.Loading);
  public state$: Observable<ServiceState> = this.state.asObservable();

  constructor(
    private apiAuthService: ApiAuthService,
    private router: Router,
    private languageService: LanguageService,
    private userService: UserService,
    private translateService: TranslateService,
  ) {}

  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
    token: string
  ): Promise<boolean> {
    try {
      await this.apiAuthService.changePassword(username, oldPassword, newPassword, token).toPromise();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @deprecated Use {@link AuthService.hotelId} for customer ID and {@link LanguageService.getLanguageId()} for language ID
   */
  getQueryParams(): QueryParams {
    return {
      customerId: this.userService.hotelId || 0,
      languageId: this.languageService.getLanguageId()
    };
  }

  async init(): Promise<void> {
    this.userService.state$.pipe(
      takeUntil(this.state$.pipe(filter(event => event === ServiceState.Ready)))
    ).subscribe(async state => {
      if (state === ServiceState.Ready) {
        await this.autoLogin();
        this.state.next(ServiceState.Ready);
      }
    });
  }

  async login(
    username: string,
    password: string,
  ): Promise<AuthenticationResult | null> {
    try {
      const result = await this.apiAuthService.login({
        username,
        password,
        target: 'angular'
      }).toPromise();
      return reduceRawAuthenticationResult(result);
    } catch (error) {
      return null;
    }
  }

  logout(reason: LogoutReason = 'logout'): void {
    removeToken();
    this.userService.setLoggedIn(false);
    navigateToLogin(reason);
  }

  private async autoLogin(): Promise<void> {
    if (!this.userService || !this.userService.hotelId || !this.languageService || !this.languageService.getLanguageId()) {
      navigateToLogin('invalid-token');
      return;
    }

    try {
      const auth = await this.apiAuthService.checkAuth().toPromise();
      if (auth && auth.status === 'OK') {
        this.handleAuthCheckSuccess(true);
      } else {
        this.handleAuthCheckFailureError(true);
      }
    } catch (error) {
      if (error && error.message && error.message.match(/^token fail/)) {
        this.handleAuthCheckFailureError(true);
      } else {
        this.handleAuthCheckError();
      }
    }
  }

  private async startAuthCheckTimer(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, checkAuthTimeout * 1000));
    try {
      const auth = await this.apiAuthService.checkAuth('expiryCheck').toPromise();
      if (auth && auth.status === 'OK') {
        this.handleAuthCheckSuccess(false);
      } else {
        this.handleAuthCheckFailureError(false);
      }
    } catch (error) {
      this.handleAuthCheckFailureError(false);
    }
  }

  private handleAuthCheckSuccess(firstCheck: boolean): void {
    if (firstCheck) {

      this.userService.setLoggedIn(true);
    }
    this.startAuthCheckTimer();
  }

  private async handleAuthCheckError(): Promise<void> {
    const translation: string = await this.translateService.get('BackEnd_WikiLanguage.EB_GeneralError').toPromise();
    alert(translation);
  }

  private handleAuthCheckFailureError(firstCheck?: boolean): void {
    removeToken();
    this.userService.setLoggedIn(false);
    navigateToLogin(firstCheck ? 'invalid-token' : 'timeout');
  }

  ngOnDestroy(): void { }
}

function navigateToLogin(reason?: LogoutReason): void {
  const parameters: string[] = [];
  if (reason) {
    parameters.push('reason=' + reason);
  }
  redirectToLogin(parameters);
}

export interface QueryParams {
  customerId: number;
  languageId: number;
}

const cookieName = 'juliaAngularToken';

export function saveToken(accessToken: string, rememberMe: boolean): void {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  setCookie(cookieName, accessToken, rememberMe ? expirationDate : undefined);
}

function removeToken(): void {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - 7);
  setCookie(cookieName, '', expirationDate);
}

function setCookie(name: string, value: string, expirationDate?: Date): void {
  const expiration = expirationDate ? `; expires=${expirationDate.toUTCString()}` : '';
  const sameSiteSettings = !document.location.protocol.match(/^https/) ? 'SameSite=Strict' : 'SameSite=None; secure';
  document.cookie = `${name}=${value}${expiration}; path=/; ${sameSiteSettings}`;
}

export type LogoutReason = 'logout' | 'invalid-token' | 'timeout' | 'password-change';
