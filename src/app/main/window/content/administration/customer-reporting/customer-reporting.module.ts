import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { TableModule } from '../../../shared/table/table.module';
import { CustomerReportingComponent } from './customer-reporting.component';

@NgModule({
  declarations: [CustomerReportingComponent],
  imports: [
    CommonModule,
    TableModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    TableModule
  ],
  entryComponents: [CustomerReportingComponent]
})
export class CustomerReportingModule { }
