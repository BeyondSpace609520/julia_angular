import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { filter, skipWhile, switchMap, takeUntil } from 'rxjs/operators';
import MobileDetect from 'mobile-detect';


const listenerOptions = {
  passive: true,
  capture: true,
};


@Directive({
  selector: '[appDragScroll]'
})
export class DragScrollDirective implements OnInit, OnDestroy {
  @Input() dragScrollOnMobile = true;
  @Input() dragScrollPreventElement: ElementRef;
  @Input() preventScroll: boolean;

  private destroy$ = new Subject();
  private lastX: number;
  private lastY: number;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
  ) {}

  private isRelevantMouseDownEvent = (event: MouseEvent) => {
    if (event.altKey) { return false; }

    if (this.dragScrollPreventElement) {
      return !this.dragScrollPreventElement.nativeElement.contains(event.target);
    }

    return true;
  }

  private setCoordsFromEvent = (event: MouseEvent) => {
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  private moveNodeFromLastPosition = (event: MouseEvent) => {
    const el = this.el.nativeElement;
    el.scrollBy(
      this.lastX - event.clientX,
      this.lastY - event.clientY,
    );
    this.setCoordsFromEvent(event);
  }

  private preventDraggingWhenMovingItem = (event: TouchEvent) => {
    if (this.dragScrollPreventElement && this.dragScrollPreventElement.nativeElement.contains(event.target)) {
      // timeline dragging has to be disabled if the user moves an item
      event.preventDefault();
    }
  }

  initListeners() {
    // Get mouse events
    const touchMove$ = fromEvent(this.el.nativeElement, 'touchmove', listenerOptions);
    const mouseUp$ = fromEvent(document, 'mouseup', listenerOptions);
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown', listenerOptions)
      .pipe(filter(this.isRelevantMouseDownEvent));

    const dragDrop$ = mouseDown$
      .pipe(switchMap(() => mouseMove$
        .pipe(takeUntil(mouseUp$))));

    // Subscribe to mouse events
    mouseDown$
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.setCoordsFromEvent);

    dragDrop$
      .pipe(
        takeUntil(this.destroy$),
        skipWhile(() => this.preventScroll)
      )
      .subscribe(this.moveNodeFromLastPosition);

    touchMove$
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.preventDraggingWhenMovingItem);
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.dragScrollOnMobile && this.isMobileDevice()) { return; }

      this.initListeners();
    });
  }

  private isMobileDevice() {
    return new MobileDetect(window.navigator.userAgent).mobile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
