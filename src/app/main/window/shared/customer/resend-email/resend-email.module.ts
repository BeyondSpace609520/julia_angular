import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { ResendEmailComponent } from './modal/resend-email.component';
import { ResendEmailDirective } from './resend-email.directive';

@NgModule({
  declarations: [ResendEmailDirective, ResendEmailComponent],
  exports: [ResendEmailDirective],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
  ],
  entryComponents: [ResendEmailComponent],
})
export class ResendEmailModule { }
