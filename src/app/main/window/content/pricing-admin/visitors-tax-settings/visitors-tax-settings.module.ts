import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { VisitorsTaxSettingsComponent } from './visitors-tax-settings.component';

@NgModule({
  declarations: [VisitorsTaxSettingsComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [VisitorsTaxSettingsComponent]
})
export class VisitorsTaxSettingsModule { }
