import { Directive, EventEmitter, HostBinding, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export type SortDirection = 'asc' | 'desc';

export interface SortEvent {
    column: string;
    direction: SortDirection;
}

@Directive({
// tslint:disable-next-line: directive-selector
    selector: 'th[sortable]'
})
export class NgbdSortableHeaderDirective implements OnChanges {
    @Input() sortable: string;
    @Input() currentSortable: SortEvent;
    @Input() direction: SortDirection = 'asc';
    @Output() sort = new EventEmitter<SortEvent | null>();

    @HostBinding('class.asc')
    get asc() {
      return this.direction === 'asc';
    }

    @HostBinding('class.desc')
    get desc() {
      return this.direction === 'desc';
    }

    @HostBinding('class.sorted')
    sorted = false;

    @HostBinding('style.cursor')
    cursor = 'pointer';

    @HostListener('click')
    rotate() {
        this.direction = this.direction === 'asc' ? 'desc' : 'asc';
        this.sort.emit({ column: this.sortable, direction: this.direction });
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes.currentSortable) {
        this.sorted = this.currentSortable && this.currentSortable.column === this.sortable;
      }
    }
}
