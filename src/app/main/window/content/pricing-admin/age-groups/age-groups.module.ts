import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { AgeGroupsComponent } from './age-groups.component';
import { ManageGroupComponent } from './manage-group/manage-group.component';

@NgModule({
  declarations: [AgeGroupsComponent, ManageGroupComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    NgbTooltipModule
  ],
  entryComponents: [AgeGroupsComponent, ManageGroupComponent]
})
export class AgeGroupsModule { }
