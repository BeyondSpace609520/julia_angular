import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { CopyToModule } from '../../../shared/copy-to/copy-to.module';
import { ChooseCustomerModule } from '../../../shared/customer/choose/choose-customer.module';
import { CustomerFormModule } from '../../../shared/customer/form/form.module';
import { FormBuilderModule } from '../../../shared/forms/forms.module';
import { EditComponent } from './edit/edit.component';
import { GuestInformationComponent } from './guest-information.component';

@NgModule({
  declarations: [GuestInformationComponent, EditComponent],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormBuilderModule,
    ChooseCustomerModule,
    MainSharedModule,
    CustomerFormModule,
    CopyToModule,
    NgbTooltipModule
  ],
  entryComponents: [GuestInformationComponent]
})
export class GuestInformationModule { }
