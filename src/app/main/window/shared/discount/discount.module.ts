import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { DiscountDetailsComponent } from './details/details.component';

@NgModule({
  declarations: [DiscountDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    MainSharedModule
  ],
  exports: [DiscountDetailsComponent]
})
export class DiscountModule { }
