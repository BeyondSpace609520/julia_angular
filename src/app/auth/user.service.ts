import { Injectable, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { BehaviorSubject, Observable } from 'rxjs';

import { ServiceState } from '../helpers/models';
import { getNumericParam } from '../helpers/static.functions';
import { User } from './models';

const paramKey = 'customer';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  //#region streams
  private state: BehaviorSubject<ServiceState> = new BehaviorSubject<ServiceState>(ServiceState.Loading);
  public state$: Observable<ServiceState> = this.state.asObservable().pipe(untilDestroyed(this));
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedIn$: Observable<boolean> = this.loggedIn.asObservable().pipe(untilDestroyed(this));
  private user: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
  public user$: Observable<User | null> = this.user.asObservable().pipe(untilDestroyed(this));
  //#endregion

  private $hotelId: number | undefined;

  public get hotelId(): number | undefined {
    return this.$hotelId;
  }

  public set hotelId(hotelId: number | undefined) {
    localStorage.setItem(paramKey, String(hotelId));
    this.$hotelId = hotelId;
  }

  constructor() {
    this.hotelId = getNumericParam(paramKey, true);
    this.state.next(ServiceState.Ready);
  }

  public setLoggedIn(loggedIn: boolean): void {
    this.loggedIn.next(loggedIn);
  }

  public setUser(user: User): void {
    this.user.next(user);
  }

  ngOnDestroy(): void {}
}
