import { Pipe, PipeTransform } from '@angular/core';

import { PermissionId } from '@/app/main/permission/models';
import { PermissionService } from '@/app/main/permission/permission.service';
import { MenuGroup, MenuItem, MenuView } from './models';
import { isMenuGroup, isMenuView } from './utils';

@Pipe({
  name: 'menuItemsVisibility'
})
export class MenuItemsVisibilityPipe implements PipeTransform {

  constructor(private permissionService: PermissionService) {}

  transform(items: MenuItem[], limit: number, after?: boolean): MenuItem[] {
    const permittedItems = this.filterMenuItemsByPermission(items);
    if (after) {
      return permittedItems.slice(limit);
    } else {
      return permittedItems.slice(0, limit);
    }
  }

  private filterMenuItemsByPermission(items: MenuItem[]): MenuItem[] {
    return items.map(item => this.filterMenuGroupItems(item)).filter(item => {
      if (isMenuView(item)) {
        return this.isMenuWindowVisible(item as MenuView);
      } else if (isMenuGroup(item)) {
        return (item as MenuGroup).subItems.length > 0;
      } else {
        return false;
      }
    });
  }

  private filterMenuGroupItems(item: MenuItem): MenuItem {
    if (!isMenuGroup(item)) {
      return item;
    }
    return {...item, subItems: (item as MenuGroup).subItems.filter(subItem => this.isMenuWindowVisible(subItem))};
  }

  private isMenuWindowVisible(item: MenuView): boolean {
    const itemPermission: PermissionId | undefined = item.viewSettings.permission;
    if (!itemPermission) {
      return true;
    }
    if (typeof itemPermission === 'string') {
      return this.permissionService.can[itemPermission];
    } else {
      return this.permissionService.can[itemPermission.id] || itemPermission.visible;
    }
  }
}
