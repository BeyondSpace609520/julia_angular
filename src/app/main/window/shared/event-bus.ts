import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { WindowModule } from '../window.module';

interface Event { name: string; data?: any; }

@Injectable({ providedIn: WindowModule })
export class EventBusService {

  subject = new Subject<Event>();

  on<E extends Event>(name: E['name']): Observable<E['data']> {
    return this.subject
      .pipe(
        filter((e: E) => {
          return e.name === name;
        }),
        map((e: E) => {
          return e.data;
        })
      );
  }

  emit<E extends Event>(name: E['name'], data?: E['data']): void {
    this.subject.next({ name, data });
  }
}
