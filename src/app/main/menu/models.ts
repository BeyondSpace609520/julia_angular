import { ViewSettings } from '@/app/main/view/models';


export interface MenuViewSettings {
  viewId: string;
  label?: ViewSettings['label'];
}

export interface MenuGroupSettings {
  label?: ViewSettings['label'];
  subItems: (MenuViewSettings | string)[];
}

export type MenuItemSettings = MenuGroupSettings | MenuViewSettings;

export type MenuSettings = (MenuItemSettings | string)[];

export interface MenuView extends MenuViewSettings {
  viewSettings: ViewSettings;
}

export interface MenuGroup {
  label?: ViewSettings['label'];
  subItems: MenuView[];
}

export type MenuItem = MenuGroup | MenuView;
