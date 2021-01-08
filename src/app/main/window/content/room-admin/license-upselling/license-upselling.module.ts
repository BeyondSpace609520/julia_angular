import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { LicenseUpsellingComponent } from './license-upselling.component';

@NgModule({
  declarations: [LicenseUpsellingComponent],
  imports: [CommonModule, UIKitModule, HttpModule.forRoot()],
  entryComponents: [LicenseUpsellingComponent],
})
export class LicenseUpsellingModule {}
