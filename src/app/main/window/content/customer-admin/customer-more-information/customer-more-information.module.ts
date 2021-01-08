import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { CustomerFormModule } from '../../../shared/customer/form/form.module';
import { CustomerMoreInformationComponent } from './customer-more-information.component';

@NgModule({
  declarations: [CustomerMoreInformationComponent],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    CustomerFormModule
  ],
  entryComponents: [
    CustomerMoreInformationComponent
  ]
})
export class CustomerMoreInformationModule { }
