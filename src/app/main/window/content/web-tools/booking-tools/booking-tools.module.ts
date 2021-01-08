import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { BookingToolsComponent } from './booking-tools.component';

@NgModule({
  declarations: [BookingToolsComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [BookingToolsComponent]
})
export class BookingToolsModule { }
