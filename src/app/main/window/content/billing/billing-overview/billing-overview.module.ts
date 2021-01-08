import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule as UIKitModule } from 'easybooking-ui-kit/shared.module';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { HttpModule } from '@/app/shared/http.module';
import { SharedModule } from '@/app/shared/module';
import { AnonymizeCustomerModule } from '../../../shared/customer/anonymize/anonymize.module';
import { ChooseCustomerModule } from '../../../shared/customer/choose/choose-customer.module';
import { ResendEmailModule } from '../../../shared/customer/resend-email/resend-email.module';
import { SettingsButtonModule } from '../../../shared/settings-button/settings-button.module';
import { TableModule } from '../../../shared/table/table.module';
import { BillingOverviewComponent } from './billing-overview.component';
import { ExportInvoiceComponent } from './modal/export-invoice/export-invoice.component';
import { ShowBillSplitIconComponent } from './modal/show-bill-split-icon/show-bill-split-icon.component';
import { BillingInvoiceRowClassesPipe } from './tabs/billing-invoices-tab/billing-invoice-row-classes.pipe';
import { BillingInvoicesTabComponent } from './tabs/billing-invoices-tab/billing-invoices-tab.component';
import { ActionsComponent } from './tabs/billing-invoices-tab/manage-invoice/actions/actions.component';
import { CanAddProductPipe } from './tabs/billing-invoices-tab/manage-invoice/actions/can-add-product.pipe';
import { CanAnonymizePipe } from './tabs/billing-invoices-tab/manage-invoice/actions/can-anonymize.pipe';
import { CanGenerateInvoicePipe } from './tabs/billing-invoices-tab/manage-invoice/actions/can-generate-invoice.pipe';
import { NewProductComponent } from './tabs/billing-invoices-tab/manage-invoice/actions/new-product/new-product.component';
import { ResendEmailDataPipe } from './tabs/billing-invoices-tab/manage-invoice/actions/resend-email-data.pipe';
import { FormComponent } from './tabs/billing-invoices-tab/manage-invoice/form/form.component';
import { RegformsComponent } from './tabs/billing-invoices-tab/manage-invoice/form/regforms/regforms.component';
import { ManageInvoiceComponent } from './tabs/billing-invoices-tab/manage-invoice/manage-invoice.component';
import { PaymentsComponent } from './tabs/billing-invoices-tab/manage-invoice/payments/payments.component';
// tslint:disable: max-line-length
import { PrintPaymentIframeComponent } from './tabs/billing-invoices-tab/manage-invoice/payments/print-payment-iframe/print-payment-iframe.component';
import { CreditCardIsAvailablePipe } from './tabs/billing-invoices-tab/manage-invoice/payments/save-payment-modal/credit-card-is-available.pipe';
import { SavePaymentModalComponent } from './tabs/billing-invoices-tab/manage-invoice/payments/save-payment-modal/save-payment-modal.component';
import { SendConfirmationComponent } from './tabs/billing-invoices-tab/manage-invoice/payments/send-confirmation/send-confirmation.component';
import { EditType1Component } from './tabs/billing-invoices-tab/manage-invoice/table/edit/edit-type1/edit-type1.component';
import { EditType2Component } from './tabs/billing-invoices-tab/manage-invoice/table/edit/edit-type2/edit-type2.component';
import { EditType3Component } from './tabs/billing-invoices-tab/manage-invoice/table/edit/edit-type3/edit-type3.component';
import { EditType4Component } from './tabs/billing-invoices-tab/manage-invoice/table/edit/edit-type4/edit-type4.component';
import { ProductPermissionPipe } from './tabs/billing-invoices-tab/manage-invoice/table/product-permission.pipe';
import { TableComponent } from './tabs/billing-invoices-tab/manage-invoice/table/table.component';
import { BillingReceiptsTabComponent } from './tabs/billing-receipts-tab/billing-receipts-tab.component';
// tslint:enable: max-line-length

@NgModule({
  declarations: [
    BillingOverviewComponent,
    BillingReceiptsTabComponent,
    BillingInvoicesTabComponent,
    ManageInvoiceComponent,
    TableComponent,
    FormComponent,
    PaymentsComponent,
    ShowBillSplitIconComponent,
    ActionsComponent,
    RegformsComponent,
    EditType1Component,
    EditType2Component,
    EditType3Component,
    EditType4Component,
    SavePaymentModalComponent,
    ExportInvoiceComponent,
    SendConfirmationComponent,
    PrintPaymentIframeComponent,
    NewProductComponent,
    BillingInvoiceRowClassesPipe,
    CanAddProductPipe,
    CanGenerateInvoicePipe,
    CanAnonymizePipe,
    ResendEmailDataPipe,
    CreditCardIsAvailablePipe,
    ProductPermissionPipe,
  ],
  imports: [
    CommonModule,
    UIKitModule,
    NgbDatepickerModule,
    FormsModule,
    SharedModule,
    HttpModule.forRoot(),
    TranslateModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    MainSharedModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    TableModule,
    AnonymizeCustomerModule,
    ResendEmailModule,
    SettingsButtonModule,
    VirtualScrollerModule,
    ChooseCustomerModule,
  ],
  providers: [DecimalPipe],
  entryComponents: [
    BillingOverviewComponent,
    ManageInvoiceComponent,
    ShowBillSplitIconComponent,
    RegformsComponent,
    EditType1Component,
    EditType2Component,
    EditType3Component,
    EditType4Component,
    SavePaymentModalComponent,
    ExportInvoiceComponent,
    SendConfirmationComponent,
    PrintPaymentIframeComponent,
    NewProductComponent,
  ],
})
export class BillingOverviewModule {}
