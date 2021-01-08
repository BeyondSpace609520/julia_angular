import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { OperationSettingsComponent } from './operation-settings.component';

@NgModule({
  declarations: [OperationSettingsComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot(),
  ],
  entryComponents: [OperationSettingsComponent]
})
export class OperationSettingsModule { }
