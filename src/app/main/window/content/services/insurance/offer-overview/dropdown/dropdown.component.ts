import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface DropdownItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.pug',
  styleUrls: ['./dropdown.component.sass']
})
export class DropdownComponent implements OnInit {

  @Input() items!: DropdownItem[];
  @Output() selected = new EventEmitter<DropdownItem['id']>();

  constructor() { }

  ngOnInit() {
  }

  clearSelection() {
    const selection = window.getSelection();

    if (selection) { selection.removeAllRanges(); }
  }
}
