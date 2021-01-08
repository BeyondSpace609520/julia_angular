import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChild,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

export type ListViewItem = unknown & { id?: number };

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.pug',
  styleUrls: ['./list-view.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewComponent<T extends ListViewItem> implements OnChanges {
  @Input() autoScroll = true;
  @Input() enableDragSort?: boolean;
  @Input() items!: T[];
  @Input() itemIdField: string = 'id';
  @Input() selected!: T | number | string | null;
  @Output() itemsSorted = new EventEmitter<T[]>();
  @Output() select = new EventEmitter<T>();
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  public sortableItems: T[];

  public onClick(item: T): void {
    this.select.emit(item);
  }

  public trackByFn(index: number, item: ListViewItem): string | number {
    if (!item) {
      return 0;
    }
    return item[this.itemIdField] || index;
  }

  ngOnChanges({items}: SimpleChanges): void {
    if (items && items.currentValue) {
      this.sortableItems = [...items.currentValue];
    }
  }
}
