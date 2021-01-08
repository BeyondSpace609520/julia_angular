import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { QuillModule } from 'ngx-quill';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { FormBuilderModule } from '../../../shared/forms/forms.module';
import { InsertModalModule } from '../../../shared/insert-modal/insert-modal.module';
import { CustomersComponent } from './customers.component';
import { DetailComponent } from './tabs/detail/detail.component';
import { LoginComponent } from './tabs/login/login.component';
import { EditUserComponent } from './tabs/users/edit-user/edit-user.component';
import { UsersComponent } from './tabs/users/users.component';

@NgModule({
  declarations: [CustomersComponent, DetailComponent, UsersComponent, EditUserComponent, LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormBuilderModule,
    InsertModalModule,
    QuillModule.forRoot()
  ],
  entryComponents: [CustomersComponent]
})
export class CustomersModule { }
