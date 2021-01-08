import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { QuillModule } from 'ngx-quill';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { InsertModalModule } from '../../../shared/insert-modal/insert-modal.module';
import { SettingsButtonModule } from '../../../shared/settings-button/settings-button.module';
import { TableModule } from '../../../shared/table/table.module';
import { SpecialOffersIframeComponent } from './iframe.component';
import { AgeGroupsComponent } from './shared/age-groups/age-groups.component';
import { PricesComponent } from './shared/prices/prices.component';
import { SpecialOffersComponent } from './special-offers.component';
import { MainComponent } from './tabs-container/main/main.component';
import { PeriodComponent } from './tabs-container/period/period.component';
import { DateRangeComponent } from './tabs-container/pricing/date-range/date-range.component';
import { PeriodsComponent } from './tabs-container/pricing/periods/periods.component';
import { PricingComponent } from './tabs-container/pricing/pricing.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';

@NgModule({
  declarations: [
    SpecialOffersComponent, SpecialOffersIframeComponent, TabsContainerComponent, MainComponent,
    PricingComponent, DateRangeComponent, PeriodsComponent, PricesComponent, AgeGroupsComponent, PeriodComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    SettingsButtonModule,
    InsertModalModule,
    QuillModule.forRoot(),
    NgbTooltipModule,
    TableModule
  ],
  entryComponents: [SpecialOffersComponent]
})
export class SpecialOffersModule { }
