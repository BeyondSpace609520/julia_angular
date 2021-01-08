import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { AddGuestPaymentsComponent } from './add-guest-payments.component';

@NgModule({
  declarations: [AddGuestPaymentsComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [AddGuestPaymentsComponent]

})
export class AddGuestPaymentsModule {
}
