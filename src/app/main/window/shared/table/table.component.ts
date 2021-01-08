import {
  Component, ContentChild, ContentChildren, ElementRef,
  EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, TemplateRef, ViewChildren
} from '@angular/core';

import { TableFieldDirective } from './field.directive';
import { sort } from './sort';

type SortDirection = 'asc' | 'desc';
interface SortRule { column: string; direction: SortDirection; }

@Component({
  selector: 'app-table',
  templateUrl: './table.component.pug',
  styleUrls: ['./table.component.sass'],
})
export class TableComponent<T> implements OnChanges, OnDestroy {

  @Input() items: T[];
  @Input() clickable: boolean | 'multiple' = false;
  @Input() dblclickable = false;
  @Input() disableCellResizing = false;
  // tslint:disable-next-line: no-output-native
  @Output() select = new EventEmitter<T | T[]>();

  @ContentChildren('column', { read: TableFieldDirective }) columns: QueryList<TableFieldDirective>;
  @ContentChildren('column', { read: TemplateRef }) templates: QueryList<TemplateRef<unknown>>;
  @ContentChild('extra', { static: false }) extra?: TemplateRef<unknown>;

  @ViewChildren('headerCell') headerCells: QueryList<ElementRef>;

  public sortedItems: T[];
  public sortRule: SortRule | null = null;
  public selectedItems: T[] = [];

  private originalColumnWidth: number;

  constructor(private elementRef: ElementRef) {}

  public isSelected(item: T): boolean {
    return this.selectedItems.includes(item);
  }

  public sort(rule: SortRule | null): void {
    this.sortRule = rule;
    this.sortedItems = sort(this.items, rule);
  }

  public selectItem(e: MouseEvent, item: T): void {
    if (!this.clickable) { return; }

    if (this.clickable === 'multiple' && e.ctrlKey) {
      if (this.isSelected(item)) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      } else {
        this.selectedItems.push(item);
      }
    } else if (this.clickable) {
      this.selectedItems = [item];
    }
    if (this.clickable === 'multiple') {
      this.select.emit(this.selectedItems);
    } else {
      this.select.emit(item);
    }
  }

  public dblClickItem(item: T): void {
    if (!this.dblclickable) { return;
    } else {
      this.select.emit(item);
    }
  }

  public resizeColumnStart(columnIndex: number): void {
    const column = this.columns.toArray()[columnIndex];
    if (!column) {
      return;
    }
    this.fixColumnWidths(columnIndex);
    this.setColumnWidthToPercent(column, columnIndex);
    this.originalColumnWidth = this.getColumnCurrentWidth(columnIndex);
  }

  public resizingColumn(columnIndex: number, distance: number): void {
    const column = this.columns.toArray()[columnIndex];
    const newWidth = this.originalColumnWidth + distance;
    column.width = newWidth / this.elementRef.nativeElement.clientWidth * 100;
  }

  public resizeColumnEnd(): void {
    this.resetCalculatedWidths();
  }

  public headerClick(column: TableFieldDirective): void {
    if (column.sortable) {
      this.sort({
        column: column.sortable,
        direction: this.sortRule && this.sortRule.direction === 'asc' ? 'desc' : 'asc'
      });
    }
  }

  private fixColumnWidths(untilIndex: number): void {
    const fixedColumns = this.columns.toArray();
    fixedColumns.length = untilIndex;
    fixedColumns.forEach((column, index) => {
      if (!column.width) {
        column.calculatedWidth = this.getColumnCurrentWidth(index) / this.elementRef.nativeElement.clientWidth * 100;
      }
    });
  }

  private resetCalculatedWidths(): void {
    this.columns.forEach(column => column.calculatedWidth = undefined);
  }

  private setColumnWidthToPercent(column: TableFieldDirective, columnIndex: number): void {
    if (column.widthIsPercent && column.width) {
      return;
    }
    const width = column.width ? column.width : this.getColumnCurrentWidth(columnIndex);
    column.width = width / this.elementRef.nativeElement.clientWidth * 100;
    column.widthIsPercent = true;
  }

  private getColumnCurrentWidth(columnIndex: number): number {
    const headerCell = this.headerCells.toArray()[columnIndex];
    if (!headerCell) {
      return 0;
    }
    return headerCell.nativeElement.clientWidth;
  }

  ngOnChanges({ items }: SimpleChanges): void {
    if (items && items.currentValue !== items.previousValue) {
      this.sort(this.sortRule);
    }
  }

  ngOnDestroy(): void {}
}
