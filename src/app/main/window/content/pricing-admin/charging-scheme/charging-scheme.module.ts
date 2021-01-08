import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { ChargingSchemeComponent } from './charging-scheme.component';
import { EditType1Component } from './edit/edit-type1/edit-type1.component';
import { EditType2Component } from './edit/edit-type2/edit-type2.component';
import { EditType3Component } from './edit/edit-type3/edit-type3.component';
import { ChargesComponent } from './edit/shared/charges/charges.component';
import { GeneralComponent } from './edit/shared/general/general.component';
import { TranslationsComponent } from './edit/shared/translations/translations.component';
import { NewChargingComponent } from './new/new.component';
import { LinkedCategoriesComponent } from './linked-categories/linked-categories.component';

@NgModule({
  declarations: [
    ChargingSchemeComponent, EditType1Component, EditType2Component, EditType3Component, GeneralComponent, ChargesComponent,
    TranslationsComponent, NewChargingComponent, LinkedCategoriesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
  ],
  entryComponents: [ChargingSchemeComponent, NewChargingComponent]
})
export class ChargingSchemeModule { }
