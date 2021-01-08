import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { AnonymizationComponent } from './anonymization/anonymization.component';
import { AnonymizeComponent } from './anonymize.component';
import { ConfirmAnonymizationComponent } from './confirm-anonymization/confirm-anonymization.component';

@NgModule({
  declarations: [AnonymizeComponent, ConfirmAnonymizationComponent, AnonymizationComponent],
  exports: [AnonymizeComponent, ConfirmAnonymizationComponent],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    AnonymizationComponent,
    ConfirmAnonymizationComponent
  ]
})
export class AnonymizeCustomerModule { }
