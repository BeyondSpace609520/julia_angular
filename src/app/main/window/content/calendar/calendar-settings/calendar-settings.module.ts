import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';
import { CalendarSettingsComponent } from './calendar-settings.component';


@NgModule({
  declarations: [CalendarSettingsComponent],
  imports: [
    CommonModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    ColorPickerModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule.forRoot(),
    SharedModule
  ],
  entryComponents: [CalendarSettingsComponent]
})
export class CalendarSettingsModule {
}
