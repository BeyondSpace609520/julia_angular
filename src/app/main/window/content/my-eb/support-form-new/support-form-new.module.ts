import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { SupportFormNewComponent } from './support-form-new.component';

@NgModule({
  declarations: [SupportFormNewComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [SupportFormNewComponent]
})
export class SupportFormNewModule { }
