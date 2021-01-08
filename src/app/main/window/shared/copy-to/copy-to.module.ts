import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { SharedModule } from '@/app/shared/module';
import { CopyToComponent } from './copy-to.component';

@NgModule({
  declarations: [CopyToComponent],
  imports: [
    CommonModule,
    NgbTooltipModule,
    EasybookingUISharedModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    CopyToComponent
  ],
  entryComponents: [
    CopyToComponent
  ]
})
export class CopyToModule { }
