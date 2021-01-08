import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter, Input,
  NgZone,
  OnDestroy,
  Output
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {fromEvent} from 'rxjs/observable/fromEvent';

@Directive({
  selector: '[appCloseDatepickerOnOutsideClick]'
})
export class CloseDatepickerOnOutsideClickDirective implements OnDestroy {
  documentClicked$: Subscription;

  @Input() datepickerOpened: boolean;
  @Input() datepickerRef: ElementRef;
  @Output() datepickerOpenedChange = new EventEmitter<boolean>();

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private ref: ChangeDetectorRef,
  ) {
    this.ngZone.runOutsideAngular(() => {
      this.documentClicked$ = fromEvent(document, 'click').subscribe((event: MouseEvent) => {
        // Popover is open
        if (this.datepickerOpened) {

          // Hacking typescript to access private member
          const datepickerElementRef: ElementRef = (this.datepickerRef as any)._elementRef;

          // Not clicked on self element
          if (!this.elementRef.nativeElement.contains(event.target) && !datepickerElementRef.nativeElement.contains(event.target) && (event.target as HTMLElement).className.indexOf('range-dp-day') === -1) {
            this.datepickerOpened = false;
            this.datepickerOpenedChange.emit(this.datepickerOpened);
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
