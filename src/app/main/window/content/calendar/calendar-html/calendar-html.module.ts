import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { CalendarHTMLComponent } from './calendar-html.component';


@NgModule({
  declarations: [CalendarHTMLComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [CalendarHTMLComponent]
})
export class CalendarHTMLModule {
}
