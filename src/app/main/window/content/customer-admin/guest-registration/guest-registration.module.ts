import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SettingsButtonModule } from '@/app/main/window/shared/settings-button/settings-button.module';
import { SharedModule } from '@/app/shared/module';
import { TableModule } from '../../../shared/table/table.module';
import { GuestRegistrationComponent } from './guest-registration.component';
import { HasNumberRangePipe } from './has-number-range.pipe';
import { SelectedHotelRecordPipe } from './selected-hotel-record.pipe';
import { GuestsComponent } from './tabs/guests/guests.component';
import { OverviewComponent } from './tabs/overview/overview.component';

@NgModule({
  declarations: [GuestRegistrationComponent, OverviewComponent, GuestsComponent, HasNumberRangePipe, SelectedHotelRecordPipe],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    TableModule,
    MainSharedModule,
    VirtualScrollerModule,
    SettingsButtonModule,
  ],
  entryComponents: [GuestRegistrationComponent]
})
export class GuestRegistrationModule { }
