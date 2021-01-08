import {
  ContractRenewalData, ContractRenewalFormState, ContractRenewalFormView,
  PaymentMethod,
  PaymentMethodType,
  PaymentOptionParameters,
  PaymentOptionSettings, RenewalFormData
} from '@/ui-kit/components/modals/contract-renewal/models';
import { DATE_FORMAT_PROVIDER, PipeDate } from '@/ui-kit/injection';
import { FormatService } from '@/ui-kit/services/format.service';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

const paymentOptionSettings: PaymentOptionSettings[] = [
  {
    years: 1,
    label: 'BackEnd_WikiLanguage.CRF_Option1Year',
    discountPercent: 0
  },
  {
    years: 2,
    label: 'BackEnd_WikiLanguage.CRF_Option2Years',
    discountPercent: 10
  },
  {
    years: 3,
    label: 'BackEnd_WikiLanguage.CRF_Option3Years',
    discountPercent: 15
  },
];
const defaultPaymentOption = 2;
const paymentMethods: PaymentMethod[] = [
  {
    type: PaymentMethodType.SEPA,
    label: 'BackEnd_WikiLanguage.CRF_PaymentMethodSEPA',
  },
  {
    type: PaymentMethodType.BankTransfer,
    label: 'BackEnd_WikiLanguage.CRF_PaymentMethodBankTransfer',
  }
];

@Component({
  selector: 'app-payment-selector',
  templateUrl: './payment-selector.component.html',
  styleUrls: ['./payment-selector.component.sass']
})
export class PaymentSelectorComponent implements OnInit, OnDestroy {
  @Input() data!: ContractRenewalData;
  @Input() formData: RenewalFormData;
  @Output() formDataChange = new EventEmitter<RenewalFormData>();
  @Output() formStateChange = new EventEmitter<Partial<ContractRenewalFormState>>();

  form: FormGroup;
  paymentOptions: PaymentOptionParameters[] = [];
  selectedOption: PaymentOptionParameters;
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod?: PaymentMethod;
  validUntilDate: string = '';

  constructor(
    @Inject(DATE_FORMAT_PROVIDER) private dateFormatter: PipeDate,
    private formatService: FormatService
  ) { }

  private createOptions(): PaymentOptionParameters[] {
    return paymentOptionSettings.map(settings => this.createOption(settings)).filter(option => option) as PaymentOptionParameters[];
  }

  private createPaymentMethods(): PaymentMethod[] {
    const {billingCountry, shippingCountry, paymentMethodType} = this.data;
    const switzerland = 'ch_123';
    if (billingCountry === switzerland || (billingCountry === '' && shippingCountry === switzerland)) {
      if (this.data.paymentMethodType === PaymentMethodType.BankTransfer) {
        this.selectPaymentMethod(this.data.paymentMethodType);
      }
      return [];
    }
    if (billingCountry !== switzerland && shippingCountry !== switzerland && paymentMethodType === PaymentMethodType.SEPA) {
      return [];
    }
    return paymentMethods;
  }

  private createOption(settings: PaymentOptionSettings): PaymentOptionParameters | null {
    const amount = Math.round(this.data.amount * (100 - settings.discountPercent)) / 100;
    const discountPerYear = this.data.amount - amount;

    const untilDate = this.getUntilDateForYears(settings.years);
    if (!untilDate) {
      return null;
    }

    return {
      years: settings.years,
      label: settings.label,
      unitPrice: this.formatPrice(amount),
      _unitPrice: amount,
      fullPrice: this.formatPrice(amount * settings.years),
      _fullPrice: amount * settings.years,
      discount: this.formatPrice(discountPerYear * settings.years),
      discountPercent: settings.discountPercent,
      fromDate: this.formatDate(this.data.from),
      _fromDate: this.data.from,
      untilDate: this.formatDate(untilDate),
      _untilDate: untilDate
    }
  }

  private getUntilDateForYears(years: number): Date | undefined {
    switch (years) {
      case 1:
        return this.data.untilFor1Year;
      case 2:
        return this.data.untilFor2Years;
      case 3:
        return this.data.untilFor3Years;
      default:
        return undefined;
    }
  }

  private init(): void {
    this.paymentOptions = this.createOptions();
    this.paymentMethods = this.createPaymentMethods();
    this.validUntilDate = this.formatDate(this.data.validUntil);
    this.setupForm();
    this.formStateChange.emit();
  }

  private formatDate(date: Date): string {
    return this.formatService.dateFormat(
      date,
      this.dateFormatter.getFormat()
    ) || '';
  }

  private formatPrice(amount: number): string {
    return this.formatService.priceFormat(amount) || '';
  }

  private getNextStep(): ContractRenewalFormView | undefined {
    if (this.data.paymentMethodType === PaymentMethodType.BankTransfer && !!this.selectedPaymentMethod && this.selectedPaymentMethod.type === PaymentMethodType.SEPA) {
      return 'sepa';
    }
    return undefined;
  }

  private selectOption(years: number): void {
    const selectedOption = this.paymentOptions.find(option => option.years === years);
    if (selectedOption) {
      this.selectedOption = selectedOption;
      this.updateFormData({option: this.selectedOption});
    }
  }

  private selectPaymentMethod(paymentMethodType: PaymentMethodType): void {
    this.selectedPaymentMethod = paymentMethods.find(paymentMethod => paymentMethod.type === paymentMethodType);
    this.updateFormData({paymentMethod: this.selectedPaymentMethod});
  }

  private setupForm(): void {
    const selectedOption = new FormControl(
      this.formData.option ? this.formData.option.years : defaultPaymentOption,
      [Validators.required]
    );
    const selectedPaymentMethod = new FormControl(
      this.formData.paymentMethod ? this.formData.paymentMethod.type : null,
      this.paymentMethods.length > 0 ? [Validators.required] : []
    );
    this.form = new FormGroup({
      selectedOption,
      termsAccepted: new FormControl(false, [Validators.requiredTrue]),
      selectedPaymentMethod
    });
    this.selectOption(selectedOption.value);
    this.selectPaymentMethod(selectedPaymentMethod.value);
    this.formStateChange.emit({
      valid: this.form.valid,
      nextStep: this.getNextStep()
    });

    selectedOption.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      this.selectOption(+value);
    });

    selectedPaymentMethod.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      this.selectPaymentMethod(value);
    });

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.formStateChange.emit({
        valid: this.form.valid,
        nextStep: this.getNextStep()
      });
    });
  }

  private updateFormData(data: Partial<RenewalFormData>): void {
    if (!this.formData) {
      this.formData = {};
    }
    this.formData = {...this.formData, ...data};
    this.formDataChange.emit(this.formData);
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {}
}
