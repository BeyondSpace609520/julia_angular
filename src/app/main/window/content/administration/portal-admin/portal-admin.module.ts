import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { TableModule } from '../../../shared/table/table.module';
import { CategoriesComponent } from './categories/categories.component';
import { EditCategoryComponent } from './categories/edit/edit.component';
import { PortalAdminComponent } from './portal-admin.component';
import { AddPortalComponent } from './portals/add-portal/add-portal.component';
import { CategoriesComponent as PortalCategoriesComponent } from './portals/categories/categories.component';
import { ConfigComponent } from './portals/config/config.component';
import { AddPortalCustomerComponent } from './portals/customers/add/add.component';
import { CustomersComponent } from './portals/customers/customers.component';
import { EditComponent } from './portals/customers/edit/edit.component';
import { PortalsComponent } from './portals/portals.component';

@NgModule({
  declarations: [
    PortalAdminComponent, PortalsComponent, ConfigComponent, CustomersComponent,
    EditComponent, AddPortalCustomerComponent, AddPortalComponent, PortalCategoriesComponent,
    CategoriesComponent, EditCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    VirtualScrollerModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    TableModule,
    VirtualScrollerModule
  ],
  entryComponents: [PortalAdminComponent, AddPortalCustomerComponent, AddPortalComponent]
})
export class PortalAdminModule { }
