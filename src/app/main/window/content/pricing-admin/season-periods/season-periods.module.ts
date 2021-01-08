import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { PeriodConfigModule } from '../../../shared/period-config/period-config.module';
import { SettingsButtonModule } from '../../../shared/settings-button/settings-button.module';
import { EditPeriodComponent } from './edit-period/edit-period.component';
import { ManagePeriodComponent } from './manage-period/manage-period.component';
import { NewPeriodModalComponent } from './new-period-modal/new-period-modal.component';
import { SeasonPeriodsComponent } from './season-periods.component';


@NgModule({
  declarations: [
    SeasonPeriodsComponent,
    ManagePeriodComponent,
    NewPeriodModalComponent,
    EditPeriodComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    SharedModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    PeriodConfigModule,
    SettingsButtonModule,
  ],
  entryComponents: [SeasonPeriodsComponent, NewPeriodModalComponent],
})
export class SeasonPeriodsModule {}
