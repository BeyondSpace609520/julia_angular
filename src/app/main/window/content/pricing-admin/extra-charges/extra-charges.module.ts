import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { ExtraChargesComponent } from './extra-charges.component';

@NgModule({
  declarations: [ExtraChargesComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe)
  ],
  entryComponents: [ExtraChargesComponent]
})
export class ExtraChargesModule { }
