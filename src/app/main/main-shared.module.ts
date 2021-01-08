import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/module';
import { PermissionComponent } from './permission/permission.component';
import { EbDatePipe } from './shared/eb-date.pipe';
import { FormDataService } from './shared/form-data.service';
import { FormatNumberPipe } from './shared/format-number.pipe';
import { ViewService } from './view/view.service';

const declarations = [
  EbDatePipe,
  FormatNumberPipe,
  PermissionComponent,
];

@NgModule({
  declarations,
  imports: [
    CommonModule,
    NgbTooltipModule,
    SharedModule,
  ],
  providers: [DatePipe, FormDataService, EbDatePipe, FormatNumberPipe, ViewService],
  exports: declarations
})
export class MainSharedModule { }
