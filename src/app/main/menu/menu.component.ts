import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';

import { getViewSettings } from '../view/utils';
import items from './items.json';
import { MenuGroup, MenuGroupSettings, MenuItem, MenuSettings, MenuView, MenuViewSettings } from './models';
import { isMenuGroupSettings, isMenuViewSettings } from './utils';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.pug',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements AfterViewInit {

  @HostBinding('class.initialization') initialization = true;
  @Input() refreshSizes: EventEmitter<void>;

  public menu: MenuItem[] = [];
  public visibleCount = this.menu.length;

  @HostListener('window:resize')
  public onResize(init?: boolean): void {
    if (init) {
      this.visibleCount = this.menu.length;
      setTimeout(() => {
        this.onResize();
      });
      return;
    }
    const container = this.el.nativeElement;
    if (container) {
      const blocks = [...container.querySelectorAll('.item.main')];
      const width = container.clientWidth - (container.querySelector('.dropdown') ? container.querySelector('.dropdown').clientWidth : 0);
      const offsets = blocks.reduce((acc: number[], child: HTMLElement) => [...acc, (acc[acc.length - 1] || 0) + child.clientWidth], []);
      this.initialization = false;
      for (const i in offsets) {
        if (offsets[i] > width) {
          this.visibleCount = (+i - 1) < 0 ? 0 : (+i - 1);
          return;
        }
      }
      // the menu should not be too close to other navigation items
      if (width - offsets[offsets.length - 1] < 100) {
        this.visibleCount = this.menu.length - 1;
        return;
      }
      this.visibleCount = this.menu.length;
    }
  }

  private setupMenu(): void {
    const menuSettings = items as MenuSettings;
    this.menu = menuSettings.map(item => this.getMenuItem(item)).filter(item => item !== null) as MenuItem[];
  }

  private getMenuItem(settings: MenuGroupSettings | MenuViewSettings | string): MenuGroup | MenuView | null {
    if (typeof settings === 'string') {
      return this.getMenuView({ viewId: settings });
    } else if (isMenuViewSettings(settings)) {
      return this.getMenuView(settings as MenuViewSettings);
    } else if (isMenuGroupSettings(settings)) {
      return this.getMenuGroup(settings as MenuGroupSettings);
    }
    return null;
  }

  private getMenuView(settings: MenuViewSettings): MenuView | null {
    const { viewId, label } = settings;
    const viewSettings = getViewSettings(viewId);
    if (!viewSettings) {
      return null;
    }
    return { viewId, label, viewSettings };
  }

  private getMenuGroup(settings: MenuGroupSettings): MenuGroup | null {
    const subItems: MenuGroup['subItems'] = (settings as MenuGroupSettings).subItems.map(subSettings => {
      return this.getMenuView(typeof subSettings === 'string' ? { viewId: subSettings} : subSettings as MenuViewSettings);
    }).filter(group => group !== null) as MenuGroup['subItems'];
    if (subItems.length === 0) {
      return null;
    }
    return {
      label: settings.label,
      subItems
    };
  }

  constructor(
    private el: ElementRef,
  ) {
    this.setupMenu();
  }

  ngAfterViewInit(): void {
    if (this.refreshSizes) {
      this.refreshSizes.subscribe(() => this.onResize() );
    }
    requestAnimationFrame(() => this.onResize(true) );
  }
}
