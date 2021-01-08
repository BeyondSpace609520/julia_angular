import { DragSortItemDirective } from '@/ui-kit/directives/drag-sort/drag-sort-item.directive';
import {
  AfterContentInit,
  ContentChildren,
  Directive, EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy, Output,
  QueryList,
  SimpleChanges
} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appDragSortContainer]'
})
export class DragSortContainerDirective<T> implements OnChanges, AfterContentInit, OnDestroy {
  @Input() disableDrag?: boolean;
  @Input() dsItems!: T[];
  @Output() dsItemsSorted = new EventEmitter<T[]>();

  @ContentChildren(DragSortItemDirective) itemElements: QueryList<DragSortItemDirective<T>>;
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private draggedItem: T | null = null;
  private itemsChanged = new Subject();

  constructor() { }

  private itemDragStarted(item: T): void {
    this.draggedItem = item;
  }

  private itemDragEnded(): void {
    this.draggedItem = null;
  }

  private itemDropped(target: T): void {
    if (!this.draggedItem || this.draggedItem === target) {
      return;
    }
    const draggedIndex = this.dsItems.findIndex(item => this.draggedItem === item);
    this.dsItems.splice(draggedIndex, 1);
    const targetIndex = this.dsItems.findIndex(item => target === item);
    this.dsItems.splice(targetIndex, 0, this.draggedItem);
    this.dsItemsSorted.emit(this.dsItems);
    this.draggedItem = null;
  }

  private setupItemElements(): void {
    if (!this.itemElements) {
      return;
    }
    this.itemsChanged.next();
    this.itemElements.toArray().forEach(item => {
      item.setEnabled(!this.disableDrag);
      item.dsDragStart.pipe(untilDestroyed(this), takeUntil(this.itemsChanged)).subscribe(() => this.itemDragStarted(item.dsItem));
      item.dsDragEnd.pipe(untilDestroyed(this), takeUntil(this.itemsChanged)).subscribe(() => this.itemDragEnded());
      item.dsDropped.pipe(untilDestroyed(this), takeUntil(this.itemsChanged)).subscribe(() => this.itemDropped(item.dsItem));
    });
  }

  ngOnChanges({dsItems, disableDrag}: SimpleChanges): void {
    if (disableDrag && this.itemElements) {
      this.itemElements.map(item => item.setEnabled(!disableDrag.currentValue));
    }
    if (dsItems) {
      this.setupItemElements();
    }
  }

  ngAfterContentInit(): void {
    this.setupItemElements();
  }

  ngOnDestroy(): void {}
}
