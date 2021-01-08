import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { InsertModalModule } from '../../../shared/insert-modal/insert-modal.module';
import { GeneralSettingsComponent } from './general-settings.component';
import { ManageListComponent } from './manage-list/manage-list.component';
import { ArrivalComponent } from './tabs/arrival/arrival.component';
import { GdprComponent } from './tabs/gdpr/gdpr.component';
import { GuestRatingComponent } from './tabs/guest-rating/guest-rating.component';
import { IdentificationComponent } from './tabs/identification/identification.component';
import { InterestsComponent } from './tabs/interests/interests.component';
import { SourcesComponent } from './tabs/sources/sources.component';
import { TravelComponent } from './tabs/travel/travel.component';

@NgModule({
  declarations: [
    GeneralSettingsComponent,
    ManageListComponent,
    InterestsComponent,
    TravelComponent,
    ArrivalComponent,
    IdentificationComponent,
    GuestRatingComponent,
    SourcesComponent,
    GdprComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    NgbTooltipModule,
    RxReactiveFormsModule,
    InsertModalModule
  ],
  entryComponents: [
    GeneralSettingsComponent
  ]
})
export class GeneralSettingsModule { }
