import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { ChooseGuestComponent } from './choose-guest/choose-guest.component';
import { CreateRegistrationFormComponent } from './create-registration-form.component';
import { CreateRegistrationFormService } from './create-registration-form.service';
import { EditGuestComponent } from './edit-guest/edit-guest.component';
import { GroupComponent } from './guests-list/group/group.component';
import { IndividualComponent } from './guests-list/individual/individual.component';
import { OrderGuestsPipe } from './order-guests.pipe';

@NgModule({
  declarations: [CreateRegistrationFormComponent, IndividualComponent, GroupComponent, ChooseGuestComponent, EditGuestComponent, OrderGuestsPipe],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    MainSharedModule,
    NgbTooltipModule
  ],
  providers: [CreateRegistrationFormService],
  entryComponents: [CreateRegistrationFormComponent, ChooseGuestComponent]
})
export class CreateRegistrationFormModule { }
