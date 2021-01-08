import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiReq = req.url.startsWith('/api') ? req.clone({ url: req.url.replace('/api', environment.apiUrl)}) : req;
    return next.handle(apiReq);
  }
}

export const apiInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true,
};
