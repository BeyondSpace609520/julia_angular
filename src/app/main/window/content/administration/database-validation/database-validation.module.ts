import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { TableModule } from '../../../shared/table/table.module';
import { DatabaseValidationComponent } from './database-validation.component';
import { RoomPriceErrorsComponent } from './room-price-errors/room-price-errors.component';

@NgModule({
  declarations: [DatabaseValidationComponent, RoomPriceErrorsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    NgbTooltipModule,
    TableModule
  ],
  entryComponents: [DatabaseValidationComponent]
})
export class DatabaseValidationModule { }
