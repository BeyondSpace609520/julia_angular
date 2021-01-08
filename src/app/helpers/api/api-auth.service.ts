import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationRequest, RawAuthenticationResult } from '@/app/auth/models';
import { AuthCheck } from './api-auth.models';
import { ApiErrorResponse, ApiService, AuthApiType } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  constructor(private apiService: ApiService) { }

  changePassword(username: string, oldPassword: string, newPassword: string, token: string): Observable<boolean> {
    return this.apiService.easybookingPut<(string | ApiErrorResponse)>(
      'user/changePassword',
      {
        username,
        password: newPassword,
        oldpassword: oldPassword
      },
      undefined,
      new HttpHeaders({
        'X-CSRF-Token': token
      })
    ).pipe(map(() => true));
  }

  login(data: AuthenticationRequest): Observable<RawAuthenticationResult> {
    return this.apiService.easybookingPost<RawAuthenticationResult>(
      'apiGlobal/login',
      data
    );
  }

  checkAuth(type: AuthApiType = 'login'): Observable<AuthCheck> {
    return this.apiService.authApiPost<AuthCheck>(type);
  }
}
