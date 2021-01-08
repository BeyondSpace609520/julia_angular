import { MessageComponent } from '@/ui-kit/components/message/message.component';
import { ChangePasswordService } from '@/ui-kit/components/modals/change-password/change-password.service';
import { ContractRenewalService } from '@/ui-kit/components/modals/contract-renewal/contract-renewal.service';
import { PaymentSelectorComponent } from '@/ui-kit/components/modals/contract-renewal/payment-selector/payment-selector.component';
import { PasswordChecksComponent } from '@/ui-kit/components/password-checks/password-checks.component';
import { PasswordStrengthBarComponent } from '@/ui-kit/components/password-strength-bar/password-strength-bar.component';
import { PasswordVisibilityToggleComponent } from '@/ui-kit/components/password-visibility-toggle/password-visibility-toggle.component';
import { PasswordInputDirective } from '@/ui-kit/directives/password-input.directive';
import { FilterItemsPipe } from '@/ui-kit/pipes/filter-items.pipe';
import { NotSelectedItemsPipe } from '@/ui-kit/pipes/not-selected-items.pipe';
import { SelectedItemPipe } from '@/ui-kit/pipes/selected-item.pipe';
import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { ModalDirectConnectComponent } from './components/modals/modal-direct-connect/modal-direct-connect.component';
import { ModalFormsComponent } from './components/modal-forms/modal-forms.component';
import { ModalInvoiceNoticeComponent } from './components/modal-invoice-notice/modal-invoice-notice.component';
import { ModalSimpleTextComponent } from './components/modal-simple-text/modal-simple-text.component';
import { ModalGenericComponent } from './components/modal-generic/modal-generic.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { ClosePopoverOnOutsideClickDirective } from './directives/close-popover-on-outside-click.directive';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DragScrollDirective } from './directives/drag-scroll.directive';
import { TabsComponent } from './components/tabs/tabs.component';
import { DatepickerInputComponent } from './components/datepicker-input/datepicker-input.component';
import { FormattedNumberDirective } from './directives/formatted-number-input.directive';
import { DayShortNamePipe } from './pipes/day-short-name.pipe';
import { MonthShortNamePipe } from './pipes/month-short-name.pipe';
import { ErrorCrucialComponent } from './components/error-crucial/error-crucial.component';
import { CloseDatepickerOnOutsideClickDirective } from './directives/close-datepicker-on-outside-click.directive';
import { WeekdayPipe } from './pipes/weekday.pipe';
import { MonthNamePipe } from './pipes/month-name.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AlertService } from './services/alert.service';
import { ModalService } from './services/modal.service';
import { LANGUAGE_PROVIDER, LanguageService, DATE_FORMAT_PROVIDER, PipeDate } from './injection';
import { ModalBorderlessComponent } from './components/modal-borderless/modal-borderless.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { ScrollIntoViewDirective } from './directives/scroll-into-view.directive';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { NumberInputDirective } from './directives/number-input.directive';
import { NoSanitizePipe } from './pipes/no-sanitize.pipe';
import { AutoCityInputComponent } from './components/auto-city-input/auto-city-input.component';
import { IsItemSelectedPipe } from './components/list-view/is-item-selected.pipe';
import { ShouldItemScrollPipe } from './components/list-view/should-item-scroll.pipe';
import { DragSortContainerDirective } from './directives/drag-sort/drag-sort-container.directive';
import { DragSortItemDirective } from './directives/drag-sort/drag-sort-item.directive';
import { ModalProgressComponent } from './components/modal-progress/modal-progress.component';
import { ProgressValuePipe } from './components/modal-progress/progress-value.pipe';
import { GDPRAgreementComponent } from './components/modals/gdpr-agreement/gdpr-agreement.component';
import { ContractRenewalComponent } from './components/modals/contract-renewal/contract-renewal.component';
import { ContractRenewalHelloPipe } from './components/modals/contract-renewal/contract-renewal-hello.pipe';
import { ContractRenewalButtonsComponent } from './components/modals/contract-renewal/contract-renewal-buttons/contract-renewal-buttons.component';
import { ContractRenewalButtonVisibilityPipe } from './components/modals/contract-renewal/contract-renewal-buttons/contract-renewal-button-visibility.pipe';
import { SuccessPageComponent } from './components/modals/contract-renewal/success-page/success-page.component';
import { ErrorPageComponent } from './components/modals/contract-renewal/error-page/error-page.component';
import { NewPricingComponent } from './components/modals/contract-renewal/new-pricing/new-pricing.component';
import { BreakMultilinePipe } from './pipes/break-multiline.pipe';
import { SepaAuthorizationComponent } from './components/modals/contract-renewal/sepa-authorization/sepa-authorization.component';
import { LiveChatComponent } from './components/live-chat/live-chat.component';
import { SugarDataNagscreenComponent } from './components/modals/sugar-data-nagscreen/sugar-data-nagscreen.component';
import { SaraComponent } from './components/modals/sara/sara.component';
import { ChangePasswordComponent } from './components/modals/change-password/change-password.component';
import { ChangePasswordButtonsComponent } from './components/modals/change-password/change-password-buttons/change-password-buttons.component';
import { PricingTestConsoleComponent } from './components/modals/pricing-test-console/pricing-test-console.component';
import { PricingTestConsoleRoomComponent } from './components/modals/pricing-test-console/pricing-test-console-room/pricing-test-console-room.component';
import { PricingTestConsoleShoppingCartComponent } from './components/modals/pricing-test-console/pricing-test-console-shopping-cart/pricing-test-console-shopping-cart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    UiSwitchModule,
  ],
  declarations: [
    AlertsComponent,
    CloseDatepickerOnOutsideClickDirective,
    ClosePopoverOnOutsideClickDirective,
    DatepickerInputComponent,
    DayShortNamePipe,
    DragScrollDirective,
    FormattedNumberDirective,
    LoadingComponent,
    ModalConfirmComponent,
    ModalDirectConnectComponent,
    ModalFormsComponent,
    ModalInvoiceNoticeComponent,
    ModalBorderlessComponent,
    ModalGenericComponent,
    ModalSimpleTextComponent,
    MonthNamePipe,
    MonthShortNamePipe,
    PageNotFoundComponent,
    TabsComponent,
    WeekdayPipe,
    ErrorCrucialComponent,
    ClickOutsideDirective,
    ListViewComponent,
    ScrollIntoViewDirective,
    TreeViewComponent,
    NumberInputDirective,
    AutoCityInputComponent,
    NoSanitizePipe,
    FilterItemsPipe,
    NotSelectedItemsPipe,
    SelectedItemPipe,
    IsItemSelectedPipe,
    ShouldItemScrollPipe,
    DragSortContainerDirective,
    DragSortItemDirective,
    ModalProgressComponent,
    ProgressValuePipe,
    GDPRAgreementComponent,
    ContractRenewalComponent,
    ContractRenewalHelloPipe,
    ContractRenewalButtonsComponent,
    ContractRenewalButtonVisibilityPipe,
    PaymentSelectorComponent,
    SuccessPageComponent,
    ErrorPageComponent,
    NewPricingComponent,
    BreakMultilinePipe,
    SepaAuthorizationComponent,
    LiveChatComponent,
    SugarDataNagscreenComponent,
    SaraComponent,
    ChangePasswordComponent,
    PasswordVisibilityToggleComponent,
    PasswordInputDirective,
    PasswordStrengthBarComponent,
    PasswordChecksComponent,
    MessageComponent,
    ChangePasswordButtonsComponent,
    PricingTestConsoleComponent,
    PricingTestConsoleRoomComponent,
    PricingTestConsoleShoppingCartComponent,
  ],
  entryComponents: [
    ModalConfirmComponent,
    ModalDirectConnectComponent,
    ModalFormsComponent,
    ModalInvoiceNoticeComponent,
    ModalBorderlessComponent,
    ModalGenericComponent,
    ModalSimpleTextComponent,
    ModalProgressComponent,
    ErrorCrucialComponent,
    ErrorCrucialComponent,
    ContractRenewalComponent,
    ContractRenewalButtonsComponent,
    GDPRAgreementComponent,
    SugarDataNagscreenComponent,
    SaraComponent,
    ChangePasswordComponent,
    ChangePasswordButtonsComponent,
    PricingTestConsoleComponent,
  ],
  exports: [
    ClosePopoverOnOutsideClickDirective,
    DatepickerInputComponent,
    DayShortNamePipe,
    DragScrollDirective,
    FormattedNumberDirective,
    LoadingComponent,
    MonthNamePipe,
    MonthShortNamePipe,
    TabsComponent,
    WeekdayPipe,
    ClickOutsideDirective,
    ListViewComponent,
    ScrollIntoViewDirective,
    TreeViewComponent,
    NumberInputDirective,
    AutoCityInputComponent,
    NoSanitizePipe,
    FilterItemsPipe,
    NotSelectedItemsPipe,
    SelectedItemPipe,
    DragSortContainerDirective,
    DragSortItemDirective,
    LiveChatComponent,
    PasswordVisibilityToggleComponent,
    PasswordInputDirective,
    PasswordStrengthBarComponent,
    PasswordChecksComponent,
    MessageComponent,
  ],
  providers: [
    ContractRenewalService,
    ChangePasswordService,
  ]
})
export class SharedModule {
  static forRoot(languageService: Type<LanguageService>, dateTransformPipe: Type<PipeDate>): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AlertService,
        ModalService,
        DecimalPipe,
        {
          provide: LANGUAGE_PROVIDER,
          useExisting: languageService
        },
        {
          provide: DATE_FORMAT_PROVIDER,
          useExisting: dateTransformPipe
        }
      ]
    };
  }
}
