import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { SugarInvoicesComponent } from './sugar-invoices.component';

@NgModule({
  declarations: [SugarInvoicesComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [SugarInvoicesComponent]
})
export class SugarInvoicesModule { }
