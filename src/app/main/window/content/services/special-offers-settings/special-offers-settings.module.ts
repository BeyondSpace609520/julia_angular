import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SpecialOffersSettingsComponent } from './special-offers-settings.component';

@NgModule({
  declarations: [SpecialOffersSettingsComponent],
  imports: [
    CommonModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
  ],
  entryComponents: [SpecialOffersSettingsComponent]
})
export class SpecialOffersSettingsModule { }
