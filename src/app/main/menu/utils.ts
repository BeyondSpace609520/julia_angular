import { MenuGroup, MenuGroupSettings, MenuItem, MenuItemSettings, MenuView, MenuViewSettings } from './models';

export function isMenuViewSettings(item: MenuItemSettings): boolean {
  return (
    item.hasOwnProperty('windowId') &&
    !!(item as MenuViewSettings).viewId
  );
}

export function isMenuGroupSettings(item: MenuItemSettings): boolean {
  return (
    item.hasOwnProperty('subItems') &&
    !!(item as MenuGroupSettings).subItems &&
    (item as MenuGroupSettings).subItems.length > 0
  );
}

export function isMenuView(item: MenuItem): boolean {
  return (
    item.hasOwnProperty('viewSettings') &&
    !!(item as MenuView).viewSettings
  );
}

export function isMenuGroup(item: MenuItem): boolean {
  return (
    item.hasOwnProperty('subItems') &&
    !!(item as MenuGroup).subItems &&
    (item as MenuGroup).subItems.length > 0
  );
}
