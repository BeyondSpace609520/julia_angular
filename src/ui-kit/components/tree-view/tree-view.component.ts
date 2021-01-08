import { Component, Input, Output, EventEmitter } from '@angular/core';

export type TreeViewItem = { id: number, name: string; children: TreeViewItem[] };

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.pug',
  styleUrls: ['./tree-view.component.sass']
})
export class TreeViewComponent<T extends TreeViewItem> {
  @Input() tree!: T[];
  @Input() expanded: Map<T['id'], boolean> = new Map();
  @Input() selected!: T | TreeViewItem['id'] | null;
  @Input() autoScroll = true;
  @Output() select = new EventEmitter<T>();

  onClick(item: T) {
    this.select.emit(item);
  }

  isSelected(item: TreeViewItem) {
    return this.selected !== null && (this.selected === item.id || this.selected === item);
  }

  toggle(item: TreeViewItem) {
    this.expanded.set(item.id, Boolean(!this.expanded.get(item.id)));
  }

  isExpanded(item: TreeViewItem) {
    return Boolean(this.expanded.get(item.id));
  }
}
