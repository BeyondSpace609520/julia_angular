import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { TableModule } from '../../table/table.module';
import { ChooseCustomerComponent } from './choose-customer.component';

@NgModule({
  declarations: [ChooseCustomerComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    TableModule
  ],
  entryComponents: [ChooseCustomerComponent]
})
export class ChooseCustomerModule { }
