import { FormatService } from '@/ui-kit/services/format.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { LogBackendService } from '../helpers/log-backend.service';
import { PeriodicCheckService } from '../helpers/periodic-check.service';
import { SharedModule } from '../shared/module';
import { EmbedModule } from './embed/embed.module';
import { CustomerSelectorComponent } from './header/customer-selector/customer-selector.component';
import { HeaderComponent } from './header/header.component';
import { MyAccountMenuComponent } from './header/my-account-menu/my-account-menu.component';
import { MainRoutingModule } from './main-routing.module';
import { MainSharedModule } from './main-shared.module';
import { MainService } from './main.service';
import { MainComponent } from './main/main.component';
import { MenuModule } from './menu/menu.module';
import { PermissionService } from './permission/permission.service';
import { WindowModule } from './window/window.module';

@NgModule({
  declarations: [MainComponent, HeaderComponent, MyAccountMenuComponent, CustomerSelectorComponent],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    WindowModule,
    EmbedModule,
    MainSharedModule,
    MenuModule,
    DeviceDetectorModule.forRoot(),
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    NgbModule,
    FormsModule,
  ],
  providers: [
    MainService,
    PermissionService,
    LogBackendService,
    PeriodicCheckService,
    FormatService,
  ],
})
export class MainModule {}
