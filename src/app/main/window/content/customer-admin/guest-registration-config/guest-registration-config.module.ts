import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { SharedModule as EasybookingUISharedModule } from '@/ui-kit/shared.module';
import { AddCompanyComponent } from './add-company/add-company.component';
import { GuestRegistrationConfigComponent } from './guest-registration-config.component';
import { GuestRegistrationConfigService } from './guest-registration-config.service';
import { CompanyDetailsComponent } from './tabs/company/company-details/company-details.component';
import { IsFieldVisiblePipe } from './tabs/company/company-details/is-field-visible.pipe';
import { CompanyComponent } from './tabs/company/company.component';
import { FormNumbersComponent } from './tabs/form-numbers/form-numbers.component';
import { DisableControlPipe } from './tabs/guest-types/disable-control.pipe';
import { FilterListPipe } from './tabs/guest-types/filter-list.pipe';
import { GuestTypesComponent } from './tabs/guest-types/guest-types.component';

@NgModule({
  declarations: [
    GuestRegistrationConfigComponent,
    CompanyComponent,
    CompanyDetailsComponent,
    IsFieldVisiblePipe,
    AddCompanyComponent,
    FormNumbersComponent,
    GuestTypesComponent,
    DisableControlPipe,
    FilterListPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    MainSharedModule,
    NgbTooltipModule
  ],
  exports: [
    FilterListPipe
  ],
  entryComponents: [GuestRegistrationConfigComponent, AddCompanyComponent],
  providers: [GuestRegistrationConfigService]
})
export class GuestRegistrationConfigModule { }
