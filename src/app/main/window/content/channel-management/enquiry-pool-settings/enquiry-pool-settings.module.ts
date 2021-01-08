import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { EnquiryPoolSettingsComponent } from './enquiry-pool-settings.component';

@NgModule({
  declarations: [EnquiryPoolSettingsComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [EnquiryPoolSettingsComponent]
})
export class EnquiryPoolSettingsModule { }
