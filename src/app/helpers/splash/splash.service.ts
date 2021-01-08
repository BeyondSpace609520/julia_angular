import { Injectable, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashService implements OnDestroy {

  private visible = new BehaviorSubject<boolean>(true);
  visible$ = this.visible.pipe(untilDestroyed(this));

  constructor() { }

  hide(): void {
    this.visible.next(false);
    this.visible.complete();
  }

  ngOnDestroy(): void {}
}
