import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollIntoView]'
})
export class ScrollIntoViewDirective implements OnInit {

  @Input() shouldScroll: boolean;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    if (this.shouldScroll) {
      const el = this.element.nativeElement as HTMLElement;

      el.scrollIntoView();
    }
  }
}
