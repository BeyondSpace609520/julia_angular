import { Component, HostBinding, HostListener, Input } from '@angular/core';

import { ViewService } from '@/app/main/view/view.service';
import { MenuItem, MenuView } from '../models';
import { isMenuView } from '../utils';

@Component({
  selector: 'app-menu-item',
  templateUrl: './item.component.pug',
  styleUrls: ['./item.component.sass']
})
export class ItemComponent {
  @Input() item!: MenuItem;
  @HostBinding('class.inactive') @Input() inactive: boolean;
  @HostBinding('tabindex') @Input() tabindex = null;

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    e.stopPropagation();
    if (isMenuView(this.item)) {
      this.doActionFor(this.item as MenuView);
    }
  }

  constructor(
    private viewService: ViewService,
  ) { }

  public doActionFor(item: MenuView): void {
    if (item.viewSettings) {
      this.viewService.openView(item.viewSettings);
    }
  }
}
