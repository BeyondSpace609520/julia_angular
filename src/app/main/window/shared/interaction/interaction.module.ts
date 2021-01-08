import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { TableModule } from '../table/table.module';
import { InteractionComponent } from './interaction.component';

@NgModule({
  declarations: [InteractionComponent],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    SearchBarModule,
    TableModule,
    MainSharedModule
  ],
  exports: [InteractionComponent]
})
export class InteractionModule { }
