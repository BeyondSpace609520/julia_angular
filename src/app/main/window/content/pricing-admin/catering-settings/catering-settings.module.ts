import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { CateringSettingsComponent } from './catering-settings.component';

@NgModule({
  declarations: [CateringSettingsComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [CateringSettingsComponent]
})
export class CateringSettingsModule { }
