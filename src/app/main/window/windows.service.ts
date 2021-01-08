import { Injectable, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { State, Window } from './models';

@Injectable()
export class WindowsService implements OnDestroy {
  private list = new BehaviorSubject<Window[]>([]);
  public list$ = this.list.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged()
  );
  public activeWindow: Window;

  private minimizedIndexes: {
    windowInstanceId: Window['instanceId'],
    subject: BehaviorSubject<number | null>
  }[] = [];

  constructor() {}

  public addWindow(title: string, id: string, contentSource: Window['contentSource'], onload?: () => any): void {
    const initialState = contentSource && contentSource.initial && contentSource.initial.state || State.Default;
    const instanceId = Symbol('window');
    const window = { id, instanceId, title, contentSource, state: initialState, onload } as Window;

    this.list.next([...this.list.getValue(), window]);
    this.selectWindow(window);
  }

  public closeWindow(window: Window): void {
    const list = this.list.getValue();
    list.splice(list.indexOf(window), 1);
    if (list.length > 0) {
      this.selectWindow(list[list.length - 1]);
    }
    this.deleteMinimizedIndexSubject(window);
    this.refreshMinimizedIndexes();
    this.list.next(list);
  }

  public getWindowById(id: string): Window | null {
    return this.list.getValue().find(window => window.id === id) || null;
  }

  public closeWindowById(id: string): void {
    const window = this.getWindowById(id);
    if (window) {
      this.closeWindow(window);
    }
  }

  public selectWindow(window: Window, state?: State | null): void {
    const list = [...this.list.getValue().filter(w => w !== window), window];
    this.activeWindow = window;
    if (state !== null && state !== undefined) {
      this.activeWindow.state = state;
    } else if (this.activeWindow.state === State.Minimized) {
      this.activeWindow.state = State.Default;
    }
    this.list.next(list);
  }

  public windowStateChanged(): void {
    this.list.next(this.list.getValue());
    this.refreshMinimizedIndexes();
  }

  public getMinimizedIndexObservable(window: Window): Observable<number | null> {
    return this.getMinimizedIndexSubject(window).asObservable();
  }

  private getMinimizedIndexSubject(window: Window): BehaviorSubject<number | null> {
    const existingSubject = this.minimizedIndexes.find(subject => subject.windowInstanceId === window.instanceId);
    if (existingSubject) {
      return existingSubject.subject;
    }
    const newSubject = {
      windowInstanceId: window.instanceId,
      subject: new BehaviorSubject<number | null>(this.getMinimizedIndex(window))
    };
    this.minimizedIndexes.push(newSubject);
    return newSubject.subject;
  }

  private deleteMinimizedIndexSubject(window: Window): void {
    const index = this.minimizedIndexes.findIndex(subject => subject.windowInstanceId === window.instanceId);
    if (index < 0) {
      return;
    }
    this.minimizedIndexes[index].subject.complete();
    this.minimizedIndexes.splice(index, 1);
  }

  private getMinimizedIndex(window: Window): number | null {
    if (window.state !== State.Minimized) {
      return null;
    }
    const minimizedWindows = this.getMinimizedWindows();
    return minimizedWindows.findIndex(w => w.instanceId === window.instanceId);
  }

  private refreshMinimizedIndexes(): void {
    const minimizedWindows = this.getMinimizedWindows();
    minimizedWindows.forEach(window => {
      const subject = this.getMinimizedIndexSubject(window);
      const index = this.getMinimizedIndex(window);
      subject.next(index);
    });
  }

  private getMinimizedWindows(): Window[] {
    return this.list.getValue().filter(w => w.state === State.Minimized);
  }

  ngOnDestroy(): void {}
}
