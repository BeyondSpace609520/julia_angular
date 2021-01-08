import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { SharedModule } from '@/app/shared/module';
import { InsertModalBodyComponent } from './body/body.component';

@NgModule({
  declarations: [InsertModalBodyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EasybookingUISharedModule
  ],
  entryComponents: [InsertModalBodyComponent]
})
export class InsertModalModule { }
