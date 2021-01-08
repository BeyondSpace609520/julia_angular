import { Country } from '@/app/main/models';

export interface RawContractRenewalData {
  accId: string;
  amount: string;
  billing_country: string;
  contact: {
    first_name: string,
    last_name: string,
    salutation: string
  };
  from: string;
  masterOppId: string;
  masterOppPG: string;
  pincode: string;
  pm_type: string;
  shipping_country: string;
  until: string;
  until2: string;
  until3: string;
  validUntil: string;
}

export interface ContractRenewalData {
  accountId: string;
  amount: number;
  billingCountry: string;
  contact: {
    fistName: string,
    lastName: string,
    salutation: string
  };
  from: Date;
  masterOppId: string;
  masterOppPG: string;
  pinCode: string;
  paymentMethodType: PaymentMethodType;
  shippingCountry: string;
  untilFor1Year: Date;
  untilFor2Years: Date;
  untilFor3Years: Date;
  validUntil: Date;
}

export interface ContractRenewalRequest {
  accId: string;
  masterOppId: string;
  selectedOption: string;
  selectedPM?: string;
  accountowner?: string;
  iban?: string;
  bic?: string;
  sepa_address?: string;
  sepa_postcode?: string;
  sepa_city?: string;
  sepa_country?: string;
}

export interface PaymentOptionSettings {
  years: number;
  label: string;
  discountPercent: number;
}

export interface PaymentOptionParameters {
  years: number;
  label: string;
  unitPrice: string;
  _unitPrice: number;
  fullPrice: string;
  _fullPrice: number;
  discount: string;
  discountPercent: number;
  fromDate: string;
  _fromDate: Date;
  untilDate: string;
  _untilDate: Date;
}

export type ContractRenewalFormView = 'paymentSelector' | 'sepa' | 'success' | 'error' | 'newPricing';

export interface ContractRenewalFormState {
  view?: ContractRenewalFormView;
  valid?: boolean;
  nextStep?: ContractRenewalFormView;
  previousSteps?: ContractRenewalFormView[]
}

export interface ContractRenewalButtonSettings {
  type: 'submit' | 'previous' | 'next' | 'close' | 'recommend' | 'closeWithoutRecommendation' | 'upgrade' | 'remindMeLater' | 'sepaSubmit';
  label: string;
  buttonClass: 'primary' | 'secondary';
  disableOnInvalidForm?: boolean;
}

export interface PaymentMethod {
  type: PaymentMethodType;
  label: string;
}

export enum PaymentMethodType {
  'BankTransfer' = 'bankTransfer',
  'SEPA' = 'SEPA'
}

export interface RenewalFormData {
  option?: PaymentOptionParameters;
  paymentMethod?: PaymentMethod;
  sepa?: SEPAFormData
}

export interface RecommendationVoucher {
  id: string;
  label: string;
}

export interface RecommendationFormData {
  company: string;
  city: string;
  contact: string;
  voucher: string;
}

export interface RecommendationRequest extends RecommendationFormData {
  accId: string;
}

export interface SEPAFormData {
  accountHolder: string;
  iban: string;
  postCode: string;
  city: string;
  address: string;
  country: string;
}
