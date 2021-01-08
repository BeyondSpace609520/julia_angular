import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appResizeHandle]'
})
export class ResizeHandleDirective {
  @Output() resizeStart = new EventEmitter();
  @Output() resizing = new EventEmitter<number>();
  @Output() resizeEnd = new EventEmitter();

  private startPosition: number;
  private mouseMoveWithBind = this.mouseMove.bind(this);
  private mouseUpWithBind = this.mouseUp.bind(this);

  @HostListener('click', ['$event'])
  private click(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('mousedown', ['$event'])
  onDragStart(event: MouseEvent): void {
    this.startPosition = event.pageX;
    document.addEventListener('mousemove', this.mouseMoveWithBind);
    document.addEventListener('mouseup', this.mouseUpWithBind);
    this.resizeStart.emit();
  }

  private mouseMove(event: MouseEvent) {
    const distance = event.pageX - this.startPosition;
    this.resizing.emit(distance);
  }

  private mouseUp() {
    document.removeEventListener('mousemove', this.mouseMoveWithBind);
    document.removeEventListener('mouseup', this.mouseUpWithBind);
    this.resizeEnd.emit();
  }

  constructor() { }

}
