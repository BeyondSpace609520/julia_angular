import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MessageCenterComponent } from "./message-center.component";

@NgModule({
  declarations: [MessageCenterComponent],
  imports: [CommonModule],
  entryComponents: [MessageCenterComponent],
})
export class MessageCenterModule {}
