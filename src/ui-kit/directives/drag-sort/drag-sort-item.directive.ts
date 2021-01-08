import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDragSortItem]'
})
export class DragSortItemDirective<T> {
  @Input() dsItem!: T;
  @Output() dsDragOver = new EventEmitter();
  @Output() dsDragStart = new EventEmitter();
  @Output() dsDragEnd = new EventEmitter();
  @Output() dsDropped = new EventEmitter();
  @Output() dsDragEnter = new EventEmitter();
  @Output() dsDragLeave = new EventEmitter();
  @HostBinding('class.dragging') dragging: boolean = false;
  @HostBinding('class.item-over') isItemOver: boolean = false;
  @HostBinding('attr.draggable') draggable: boolean = true;

  @HostListener('dragstart')
  onDragStart(): void {
    this.dragging = true;
    this.dsDragStart.emit();
  }
  @HostListener('dragend')
  onDragEnd(): void {
    this.dragging = false;
    this.dsDragEnd.emit();
  }
  @HostListener('dragenter')
  onDragEnter(): void {
    this.isItemOver = true;
  }
  @HostListener('dragleave')
  onDragLeave(): void {
    this.isItemOver = false;
  }
  @HostListener('drop')
  onDrop(): void {
    this.isItemOver = false;
    this.dsDropped.emit();
  }

  constructor() {
  }

  public setEnabled(enabled: boolean): void {
    this.draggable = enabled;
  }

}
