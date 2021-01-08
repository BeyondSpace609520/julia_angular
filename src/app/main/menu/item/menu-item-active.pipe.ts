import { Pipe, PipeTransform } from '@angular/core';

import { PermissionService } from '@/app/main/permission/permission.service';
import { MenuItem, MenuView } from '../models';
import { isMenuView } from '../utils';

@Pipe({
  name: 'menuItemActive'
})
export class MenuItemActivePipe implements PipeTransform {

  constructor(private permissionService: PermissionService) {}

  transform(item: MenuItem): boolean {
    if (!isMenuView(item)) {
      return true;
    }
    const permission = (item as MenuView).viewSettings.permission;
    if (!permission) {
      return true;
    }
    const permissionName = typeof permission === 'string' ? permission : permission.id;
    return this.permissionService.can[permissionName];
  }

}
