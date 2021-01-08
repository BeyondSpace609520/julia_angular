import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { SettingsComponent } from './billing-settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    UIKitModule,
  ],
  entryComponents: [SettingsComponent]
})
export class BillingSettingsModule { }
