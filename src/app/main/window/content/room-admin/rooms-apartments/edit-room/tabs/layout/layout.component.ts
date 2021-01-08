import { Component } from '@angular/core';

import { RoomListItem } from '../../../models';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.pug',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent  extends TabComponent {

  init(item: RoomListItem) {
  }
}
