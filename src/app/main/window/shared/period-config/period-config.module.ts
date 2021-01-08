import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@/app/shared/module';
import { PeriodConfigComponent } from './period-config.component';

@NgModule({
  declarations: [PeriodConfigComponent],
  exports: [PeriodConfigComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PeriodConfigModule { }
