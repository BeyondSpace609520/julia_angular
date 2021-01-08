import {
  Directive,
  ElementRef,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter, Input
} from '@angular/core';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {Subscription} from 'rxjs/Subscription';
import {getTime} from 'date-fns';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements OnDestroy {
  documentClicked$: Subscription;
  @Input() withDelay = false;
  @Output() popoverClosed = new EventEmitter();
  private initTime: number;

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private ref: ChangeDetectorRef,
  ) {
    this.initTime = getTime(new Date());
    this.ngZone.runOutsideAngular(() => {
      this.documentClicked$ = fromEvent(document, 'click').subscribe((event: MouseEvent) => {
        // Not clicked on self element
        if (!this.elementRef.nativeElement.contains(event.target)) {
          if (this.withDelay) {
            if (getTime(new Date()) - this.initTime > 50) {
              this.popoverClosed.emit();
              this.ref.detectChanges();
            }
          } else {
            this.popoverClosed.emit();
            this.ref.detectChanges();
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.documentClicked$.unsubscribe();
  }
}

// import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';
//
// @Directive({
//   selector: '[appClickOutside]'
// })
// export class ClickOutsideDirective {
//   @Output()
//   public clickOutside = new EventEmitter<MouseEvent>();
//
//   @HostListener('document:click', ['$event', '$event.target'])
//   public onClick(event: MouseEvent, targetElement: HTMLElement): void {
//     if (!targetElement) {
//       return;
//     }
//
//     const clickedInside = this._elementRef.nativeElement.contains(targetElement);
//     if (!clickedInside) {
//       this.clickOutside.emit(event);
//     }
//   }
//
//   constructor (
//     private _elementRef: ElementRef
//   ) { }
// }
