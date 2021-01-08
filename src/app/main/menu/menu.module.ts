import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { ItemComponent } from './item/item.component';
import { MenuItemActivePipe } from './item/menu-item-active.pipe';
import { MenuItemHasChildrenPipe } from './item/menu-item-has-children.pipe';
import { MenuItemLabelPipe } from './item/menu-item-label.pipe';
import { MenuItemsVisibilityPipe } from './menu-items-visibility.pipe';
import { MenuComponent } from './menu.component';

@NgModule({
  declarations: [MenuComponent, ItemComponent, MenuItemsVisibilityPipe, MenuItemActivePipe, MenuItemLabelPipe, MenuItemHasChildrenPipe],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
