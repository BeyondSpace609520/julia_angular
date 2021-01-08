import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loaderService: LoaderService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}

export const loaderInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
};
