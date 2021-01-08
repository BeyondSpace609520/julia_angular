import { Pipe, PipeTransform } from '@angular/core';

import { MenuItem, MenuView } from '../models';
import { isMenuView } from '../utils';

@Pipe({
  name: 'menuItemLabel'
})
export class MenuItemLabelPipe implements PipeTransform {

  transform(item: MenuItem): string {
    if (item.label && item.label !== '') {
      return item.label;
    }
    if (isMenuView(item)) {
      return (item as MenuView).viewSettings.label;
    }
    return '';
  }

}
