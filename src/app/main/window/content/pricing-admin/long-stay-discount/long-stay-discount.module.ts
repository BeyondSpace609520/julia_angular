import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { DiscountModule } from '../../../shared/discount/discount.module';
import { EditItemComponent } from './edit-item/edit-item.component';
import { LongStayDiscountComponent } from './long-stay-discount.component';
import { ManageItemComponent } from './manage-item/manage-item.component';
import { ManageRateComponent } from './rates/manage-rate/manage-rate.component';
import { RatesComponent } from './rates/rates.component';

@NgModule({
  declarations: [LongStayDiscountComponent, ManageItemComponent, EditItemComponent, RatesComponent, ManageRateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    NgbTooltipModule,
    DiscountModule
  ],
  entryComponents: [LongStayDiscountComponent, ManageItemComponent, ManageRateComponent]
})
export class LongStayDiscountModule { }
