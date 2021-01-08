import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/module';
import { SettingsButtonComponent } from './settings-button.component';

@NgModule({
  declarations: [SettingsButtonComponent],
  exports: [SettingsButtonComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SettingsButtonModule { }
