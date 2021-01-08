import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { fakeBackendProvider } from '@/app/helpers/fake-backend';
import { SharedModule } from '../shared/module';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@NgModule({
  providers: [
    AuthService,
    AuthGuard,
    fakeBackendProvider
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AuthCommonModule { }
