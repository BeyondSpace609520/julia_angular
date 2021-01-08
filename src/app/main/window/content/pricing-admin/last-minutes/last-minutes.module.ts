import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { AutoSizeInputModule } from 'ngx-autosize-input';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { EditItemComponent } from './edit-item/edit-item.component';
import { LastMinutesComponent } from './last-minutes.component';
import { ManageItemComponent } from './manage-item/manage-item.component';

@NgModule({
  declarations: [LastMinutesComponent, ManageItemComponent, EditItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    AutoSizeInputModule
  ],
  entryComponents: [LastMinutesComponent, ManageItemComponent]
})
export class LastMinutesModule { }
