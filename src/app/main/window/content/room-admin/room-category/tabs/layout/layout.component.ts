import { Component, EventEmitter, Output } from '@angular/core';

import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-category-layout',
  templateUrl: './layout.component.pug',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent extends TabComponent {

  @Output() saved = new EventEmitter();

}
