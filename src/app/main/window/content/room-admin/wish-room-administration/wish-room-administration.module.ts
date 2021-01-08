import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';

import { HttpModule } from '@/app/shared/http.module';
import { WishRoomAdministrationComponent } from './wish-room-administration.component';

@NgModule({
  declarations: [WishRoomAdministrationComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [WishRoomAdministrationComponent]
})
export class WishRoomAdministrationModule { }
