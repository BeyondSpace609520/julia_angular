import {
  ContractRenewalData,
  PaymentMethodType,
  RawContractRenewalData
} from '@/ui-kit/components/modals/contract-renewal/models';

export function reduceContractRenewalData(rawData: RawContractRenewalData): ContractRenewalData {
  // TODO remove
  if (window.location.hash.match(/#test-modal-upgrade/)) {
    rawData.masterOppPG = 'test';
  }
  if (window.location.hash.match(/#test-modal-payments/)) {
    rawData.billing_country = 'test';
    rawData.shipping_country = 'ch_123';
    rawData.pm_type = 'BankTransfer';
  }

  return {
    accountId: rawData.accId,
    amount: +rawData.amount,
    billingCountry: rawData.billing_country,
    contact: {
      fistName: rawData.contact.first_name,
      lastName: rawData.contact.last_name,
      salutation: rawData.contact.salutation
    },
    from: parseDate(rawData.from),
    masterOppId: rawData.masterOppId,
    masterOppPG: rawData.masterOppPG,
    pinCode: rawData.pincode,
    paymentMethodType: PaymentMethodType[rawData.pm_type],
    shippingCountry: rawData.shipping_country,
    untilFor1Year: parseDate(rawData.until),
    untilFor2Years: parseDate(rawData.until2),
    untilFor3Years: parseDate(rawData.until3),
    validUntil: parseDate(rawData.validUntil)
  };
}

function parseDate(dateString: string): Date {
  const date = new Date();
  date.setFullYear(+dateString.substr(6, 4));
  date.setMonth(+dateString.substr(3, 2)-1);
  date.setDate(+dateString.substr(0, 2));
  return date;
}
