import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { ReportAndListComponent } from './report-and-list.component';

@NgModule({
  declarations: [ReportAndListComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [ReportAndListComponent]
})
export class ReportAndListModule {
}
