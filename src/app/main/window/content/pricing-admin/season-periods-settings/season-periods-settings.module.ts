import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';

import { SeasonPeriodsSettingsComponent } from './season-periods-settings.component';

@NgModule({
  declarations: [SeasonPeriodsSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    SharedModule,
    ReactiveFormsModule,
  ],
  entryComponents: [SeasonPeriodsSettingsComponent],
})
export class SeasonPeriodsSettingsModule {}