import { Injectable, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class LoaderService implements OnDestroy {
  private $isLoading: {[key: string]: BehaviorSubject<boolean>} = {};
  private active: {[id: string]: number} = {};

  public isLoading(id: string = ''): Observable<boolean> {
    return this.getSubject(id).asObservable().pipe(distinctUntilChanged());
  }

  public isLoadingAnyOf(ids: string[]): Observable<boolean> {
    const subjects = ids.map(id => this.getSubject(id));
    return combineLatest(subjects).pipe(
      untilDestroyed(this),
      map(results => results.some(result => result)),
      distinctUntilChanged()
    );
  }

  public async wrap<T extends any>(f: () => Promise<T> | Observable<T>, id: string = ''): Promise<T> {
    try {
      this.show(id);
      const ret = f();

      return await (ret instanceof Observable ? ret.toPromise() : ret);
    } finally {
      this.hide(id);
    }
  }

  public isActive(id: string = ''): boolean {
    return Boolean(this.active[id]);
  }

  public show(id: string = ''): void {
    this.active[id] = this.active[id] ? this.active[id] + 1 : 1;
    this.getSubject(id).next(true);
  }

  public hide(id: string = ''): void {
    if (this.active[id]) {
      this.active[id]--;
      this.getSubject(id).next(this.active[id] > 0);
    }
  }

  private getSubject(id: string): BehaviorSubject<boolean> {
    if (!this.$isLoading[id]) {
      this.$isLoading[id] = new BehaviorSubject<boolean>(false);
    }
    return this.$isLoading[id];
  }

  ngOnDestroy(): void {}
}
