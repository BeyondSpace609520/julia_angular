import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { DiscountModule } from '../../../shared/discount/discount.module';
import { AddItemComponent } from './add-item/add-item.component';
import { EarlyBirdDiscountComponent } from './early-bird-discount.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ManageItemComponent } from './manage-item/manage-item.component';

@NgModule({
  declarations: [EarlyBirdDiscountComponent, ManageItemComponent, AddItemComponent, EditItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    DiscountModule
  ],
  entryComponents: [EarlyBirdDiscountComponent, AddItemComponent]
})
export class EarlyBirdDiscountModule { }
