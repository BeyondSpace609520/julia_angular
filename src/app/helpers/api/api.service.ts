import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserService } from '../../auth/user.service';
import { LanguageService } from '../../i18n/language.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private languageService: LanguageService,
  ) { }

  public authApiPost<T>(type: AuthApiType): Observable<T> {
    const url = `/api/checkAuth/${this.getApiPrefix()}`;
    return this.post<T>(url, {type});
  }

  public mainApiPost<T>(params: any[], className: string, functionName: string): Observable<T> {
    const url = `/api/mainApi/${this.getApiPrefix()}?target=${className}/${functionName}`;
    return this.post<T>(url, {params, className, functionName});
  }

  public mainApiPostText(params: any[], className: string, functionName: string): Observable<string> {
    const url = `/api/mainApi/${this.getApiPrefix()}?target=${className}/${functionName}`;
    return this.postText(url, {params, className, functionName});
  }

  public mainApiStatusPost<T>(params: any[], className: string, functionName: string) {
    type Response = { status: 'success'; } | { status: 'error', errors: { text: string; code: string; }[] };

    return this.mainApiPost<Response & T>(params, className, functionName).pipe(
      map(resp => {
        const { status, ...args } = resp;
        if (resp.status === 'error' && resp.errors) { throw resp.errors[0]; }
        return args as T;
      })
    );
  }

  public easybookingGet<T>(path: string, parameters?: {[key: string]: string | number}, pathSuffix?: string): Observable<T> {
    let url = `/easybooking/index.php/${path}/${this.getApiPrefix()}`;
    if (pathSuffix) {
      url += '/' + pathSuffix;
    }
    const queryString = createQueryString(parameters);
    if (queryString) {
      url += '?' + queryString;
    }
    return this.get(url);
  }

  public easybookingPost<T>(path: string, postData: {[field: string]: any} | FormData, parameters?: {[key: string]: string | number}): Observable<T> {
    let url = `/easybooking/index.php/${path}/${this.getApiPrefix()}`;
    const queryString = createQueryString(parameters);
    if (queryString) {
      url += '?' + queryString;
    }
    return this.post<T>(url, postData);
  }

  public easybookingPostText(path: string, data: {[field: string]: any}, parameters?: {[key: string]: string | number}): Observable<string> {
    let url = `/easybooking/index.php/${path}/${this.getApiPrefix()}`;
    const queryString = createQueryString(parameters);
    if (queryString) {
      url += '?' + queryString;
    }
    return this.postText(url, data);
  }

  public easybookingPut<T>(path: string, postData: {[field: string]: any} | FormData, parameters?: {[key: string]: string | number}, headers?: HttpHeaders): Observable<T> {
    let url = `/easybooking/index.php/${path}/${this.getApiPrefix()}`;
    const queryString = createQueryString(parameters);
    if (queryString) {
      url += '?' + queryString;
    }
    return this.put<T>(url, postData, headers);
  }

  public reportApiPost(customerId: number, sugarId: string, formData: FormData): Observable<string> {
    const url = `/easybooking/index.php/report/guestImportStep1?customerID=${customerId}&sugarId=${sugarId}`;
    return this.postText(url, formData);
  }

  public hotelApiPost(customerId: number, postData: {[field: string]: any}): Observable<string> {
    const url = `easybooking/index.php/apiHotel/saraSettings/${customerId}/1`;
    return this.postText(url, postData);
  }

  public uploadApiPost(formData: FormData, type: FileUploadType): Observable<string> {
    const url = getUploadUrl(type);
    return this.postText(url, formData);
  }

  private getApiPrefix(): string {
    return `${this.userService.hotelId}/${this.languageService.getLanguageId(true)}`;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(error.error);
  }

  private get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url).pipe(catchError(this.handleError));
  }

  private post<T>(
    url: string,
    body: {[field: string]: any}
  ): Observable<T> {
    return this.httpClient.post<T>(url, body).pipe(catchError(this.handleError));
  }

  private postText(
    url: string,
    body: {[field: string]: any}
  ): Observable<string> {
    return this.httpClient.post(url, body, {responseType: 'text'}).pipe(catchError(this.handleError));
  }

  private put<T>(
    url: string,
    body: {[field: string]: any},
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.httpClient.put<T>(url, body, {headers}).pipe(catchError(this.handleError));
  }
}

function getUploadUrl(type: FileUploadType): string {
  switch (type) {
    case FileUploadType.Image:
      return '/wo/Services/com/eBook/imageUpload/ImageUpload.php';
    default:
      return '/wo/Services/com/util/fileUpload.php';
  }
}

function createQueryString(parameters?: {[key: string]: string | number}): string | null {
  if (!parameters) {
    return null;
  }
  const keys = Object.keys(parameters);
  if (keys.length === 0) {
    return null;
  }
  return keys.map(key => {
    return key + '=' + parameters[key];
  }).join('&');
}

export enum FileUploadType {
  File,
  Image
}

export type AuthApiType = 'login' | 'expiryCheck' | 'info';

export interface ApiErrorResponse {
  code: string;
  message: string;
}
