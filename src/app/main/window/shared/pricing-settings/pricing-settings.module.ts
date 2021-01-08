import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { AutoSizeInputModule } from 'ngx-autosize-input';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { PeriodConfigModule } from '../period-config/period-config.module';
import { TableModule } from '../table/table.module';
import { PricesComponent } from './prices.component';
import { PricesService } from './prices.service';
import { ConfigurationTabComponent } from './tabs/configuration/configuration.component';
import { AgeGroupsComponent } from './tabs/main/age-groups/age-groups.component';
import { CateringsTableComponent } from './tabs/main/caterings-table/caterings-table.component';
import { MainTabComponent } from './tabs/main/main.component';
import { PersonsTableComponent } from './tabs/main/persons-table/persons-table.component';
import { AgeGroupFormatPipe } from './age-group-format.pipe';

@NgModule({
  declarations: [
    PricesComponent,
    ConfigurationTabComponent,
    MainTabComponent,
    PersonsTableComponent,
    CateringsTableComponent,
    AgeGroupsComponent,
    AgeGroupFormatPipe
  ],
  providers: [
    PricesService
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    SharedModule,
    MainSharedModule,
    PeriodConfigModule,
    NgbTooltipModule,
    AutoSizeInputModule,
    TableModule
  ],
  exports: [
    PricesComponent
  ],
})
export class PricingSettingsModule { }
