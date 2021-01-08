import { EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { RoomListItem } from '../../models';

export abstract class TabComponent implements OnChanges {

  @Input() item!: RoomListItem;
  @Output() edited = new EventEmitter();

  async ngOnChanges({ item }: SimpleChanges) {
    if (item && item.currentValue !== item.previousValue) {
      await this.init(item.currentValue);
    }
  }

  abstract init(item: RoomListItem);
}
