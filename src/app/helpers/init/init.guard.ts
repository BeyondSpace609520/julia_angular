import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { InitService } from './init.service';

@Injectable({
  providedIn: 'root'
})
export class InitGuard implements CanActivate {
  constructor(
    private initService: InitService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const loaded = new Subject<boolean>();
    this.initService.loaded$.subscribe(allLoaded => {
      loaded.next(allLoaded);
    });
    return loaded.asObservable();
  }
}
