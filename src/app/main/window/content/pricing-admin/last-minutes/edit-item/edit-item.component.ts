import { Component, EventEmitter, Input, Output } from '@angular/core';

import { LastMinutesItem } from '../models';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.pug',
  styleUrls: ['./edit-item.component.sass']
})
export class EditItemComponent {

  @Input() item!: LastMinutesItem;
  @Output() edited = new EventEmitter();


  onSave = () => {
    this.edited.emit();
  }
}
