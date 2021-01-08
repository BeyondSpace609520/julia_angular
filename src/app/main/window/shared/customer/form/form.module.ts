import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { FormBuilderModule } from '../../forms/forms.module';
import { ChooseCustomerModule } from '../choose/choose-customer.module';
import { CustomerFormComponent } from './form.component';

@NgModule({
  declarations: [CustomerFormComponent],
  imports: [
    CommonModule,
    ChooseCustomerModule,
    FormBuilderModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    SharedModule
  ],
  exports: [CustomerFormComponent]
})
export class CustomerFormModule { }
