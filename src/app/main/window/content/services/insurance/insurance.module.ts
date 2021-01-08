import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { MainSharedModule } from '@/app/main/main-shared.module';
import { SharedModule } from '@/app/shared/module';
import { SearchBarModule } from '../../../shared/search-bar/search-bar.module';
import { TableModule } from '../../../shared/table/table.module';
import { InsuranceComponent } from '../insurance/insurance.component';
import { AdvertisementComponent } from './advertisement/guest-map.component';
import { ContractSummaryComponent } from './contract-summary/contract-summary.component';
import { DropdownComponent } from './offer-overview/dropdown/dropdown.component';
import { KeyValueModalComponent } from './offer-overview/key-value-modal/key-value-modal.component';
import { OfferOverviewComponent } from './offer-overview/offer-overview.component';

@NgModule({
  declarations: [
    InsuranceComponent,
    ContractSummaryComponent,
    OfferOverviewComponent,
    AdvertisementComponent,
    DropdownComponent,
    KeyValueModalComponent
  ],
  imports: [
    CommonModule,
    EasybookingUISharedModule,
    SearchBarModule,
    SharedModule,
    ReactiveFormsModule,
    MainSharedModule,
    TableModule,
    NgbDropdownModule,
    NgbTooltipModule
  ],
  entryComponents: [InsuranceComponent, KeyValueModalComponent],
})
export class InsuranceModule { }
