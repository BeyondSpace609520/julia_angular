export enum GDPRAgreementModalStatus {
  Contract,
  FinalStep,
}

export interface GDPRAgreementContract {
  docUrl: string;
  id: string;
  name: string;
  text: string;
  textHTML: string;
  textHTMLAccordion?: string;
  validityDate: string;
  version: string;
}

export interface SugarAccountData {
  company_name_c: string;
  name: string;
  shipping_address_street: string;
  shipping_address_postalcode: string;
  shipping_address_city: string;
  shipping_address_country: string;
  orderdate_c: string;
}
