import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from '@/ui-kit/shared.module';

import { MessageCenterComponent } from '@/app/main/window/content/administration/message-center/message-center.component';
import { HttpModule } from '@/app/shared/http.module';



@NgModule({
  declarations: [MessageCenterComponent],
  imports: [
    CommonModule,
    UIKitModule,
    HttpModule.forRoot()
  ],
  entryComponents: [MessageCenterComponent]
})
export class MessageCenterModule { }
