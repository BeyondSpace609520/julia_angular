import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { InteractionModule } from '../../../shared/interaction/interaction.module';
import { SearchBarModule } from '../../../shared/search-bar/search-bar.module';
import { TableModule } from '../../../shared/table/table.module';
import { GuestInteractionComponent } from './guest-interaction.component';

@NgModule({
  declarations: [GuestInteractionComponent],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    SearchBarModule,
    TableModule,
    MainSharedModule,
    InteractionModule
  ],
  entryComponents: [
    GuestInteractionComponent
  ]
})
export class GuestInteractionModule { }
