import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutUploaderModule { }
