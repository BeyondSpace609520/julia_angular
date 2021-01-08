import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule as UIKitModule } from '@/ui-kit/shared.module';

import { RoomOwnerComponent } from './room-owner.component';

@NgModule({
  declarations: [
    RoomOwnerComponent,
  ],
  imports: [
    CommonModule,
    UIKitModule,
  ],
  entryComponents: [
    RoomOwnerComponent,
  ]
})
export class RoomOwnerModule { }
