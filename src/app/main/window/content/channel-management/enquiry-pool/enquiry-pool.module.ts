import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { MainSharedModule } from '@/app/main/main-shared.module';
import { SharedModule } from '@/app/shared/module';
import { SearchBarModule } from '../../../shared/search-bar/search-bar.module';
import { SettingsButtonModule } from '../../../shared/settings-button//settings-button.module';
import { TableModule } from '../../../shared/table/table.module';
import { ActionsComponent } from './actions/actions.component';
import { RejectionModalComponent } from './actions/rejection-modal/rejection-modal.component';
import { EnquiryPoolComponent } from './enquiry-pool.component';
import { EasybookingEnquiryPoolComponent } from './tabs/easybooking-enquiry-pool/easybooking-enquiry-pool.component';
import { DesklinePoolActivationComponent } from './tabs/deskline-pool-activation/deskline-pool-activation.component';
import { DesklinePoolComponent } from './tabs/deskline-pool/deskline-pool.component';
import { StatisticsComponent } from './tabs/statistics/statistics.component';

@NgModule({
  declarations: [
    EnquiryPoolComponent,
    ActionsComponent,
    RejectionModalComponent,
    EasybookingEnquiryPoolComponent,
    DesklinePoolActivationComponent,
    DesklinePoolComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SearchBarModule,
    FormsModule,
    ReactiveFormsModule,
    EasybookingUISharedModule,
    NgbTooltipModule,
    TableModule,
    SettingsButtonModule,
    MainSharedModule
  ],
  entryComponents: [EnquiryPoolComponent, RejectionModalComponent]
})
export class EnquiryPoolModule { }
