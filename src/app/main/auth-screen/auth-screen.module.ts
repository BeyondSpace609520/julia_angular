import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/module';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class AuthScreenModule {}
