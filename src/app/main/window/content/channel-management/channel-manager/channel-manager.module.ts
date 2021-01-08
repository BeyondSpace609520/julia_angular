import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { ChannelManagerComponent } from './channel-manager.component';

@NgModule({
  declarations: [ChannelManagerComponent],
  imports: [
    CommonModule,
    HttpModule,
    UIKitModule
  ],
  entryComponents: [ChannelManagerComponent]
})
export class ChannelManagerModule { }
