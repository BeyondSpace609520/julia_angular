import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { SharedModule } from '@/app/shared/module';
import { RoomFeaturesComponent } from './room-features.component';

@NgModule({
  declarations: [RoomFeaturesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule,
    SharedModule
  ],
  exports: [RoomFeaturesComponent]
})
export class RoomFeaturesModule { }
