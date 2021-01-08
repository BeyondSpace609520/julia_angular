import {
  Directive,
  ElementRef,
  ComponentRef,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverWindow } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {Subscription} from 'rxjs/Subscription';

@Directive({
  selector: '[appClosePopoverOnOutsideClick][ngbPopover]'
})
export class ClosePopoverOnOutsideClickDirective implements OnDestroy {
  documentClicked$: Subscription;
  @Output() popoverClosed = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private ngbPopover: NgbPopover,
    private ngZone: NgZone,
    private ref: ChangeDetectorRef
  ) {
    this.ngZone.runOutsideAngular(() => {
      this.documentClicked$ = fromEvent(document, 'click').subscribe((event: MouseEvent) => {
        // Popover is open
        if (this.ngbPopover && this.ngbPopover.isOpen()) {

          // Not clicked on self element
          if (!this.elementRef.nativeElement.contains(event.target)) {

            // Hacking typescript to access private member
            const popoverWindowRef: ComponentRef<NgbPopoverWindow> = (this.ngbPopover as any)._windowRef;

            // If clicked outside popover window
            if (!popoverWindowRef.location.nativeElement.contains(event.target)) {
              this.ngZone.run(() => {
                this.ngbPopover.close();
                this.popoverClosed.emit();
              });
            }
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.documentClicked$.unsubscribe();
  }
}
