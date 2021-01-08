import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { MainSharedModule } from '@/app/main/main-shared.module';
import { SearchBarModule } from '@/app/main/window/shared/search-bar/search-bar.module';
import { SettingsButtonModule } from '@/app/main/window/shared/settings-button/settings-button.module';
import { TableModule } from '@/app/main/window/shared/table/table.module';
import { SharedModule } from '@/app/shared/module';

import { StatisticsComponent } from '@/app/main/window/content/channel-management/statistics/statistics.component';
import { StatisticsFilterComponent } from './statistics-filter/statistics-filter.component';

@NgModule({
  declarations: [
    StatisticsComponent,
    StatisticsFilterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SearchBarModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule,
    NgbTooltipModule,
    TableModule,
    SettingsButtonModule,
    MainSharedModule,
  ],
  entryComponents: [
    StatisticsComponent,
  ]
})
export class StatisticsModule { }
