import { Pipe, PipeTransform } from '@angular/core';

import { MenuGroup, MenuItem } from '../models';
import { isMenuGroup } from '../utils';

@Pipe({
  name: 'menuItemHasChildren'
})
export class MenuItemHasChildrenPipe implements PipeTransform {

  transform(item: MenuItem): boolean {
    if (isMenuGroup(item)) {
      return !!(item as MenuGroup).subItems && (item as MenuGroup).subItems.length > 0;
    }
    return false;
  }

}
