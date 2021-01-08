export type Trigger = 'on' | 'off';

export interface SugarNagScreenData {
  addressLine: string,
  postCode: string,
  city: string,
  country: string,
  email: string,
  phone: string,
  website: string,
  businessPlan: string,      
  c_firstName: string,
  c_lastName: string,
  c_email: string,
  c_phone: string,
  c_mobil: string,
  countryList: [],
  hasBillingAddress: Trigger,
  billing_invoice_recipient_c: string,
  billing_invoice_recipient2_c: string,
  billing_addressLine: string,
  billing_postCode: string,
  billing_city: string,
  billing_country: string,
  c_technicalAffinity: string,
  technicalAffinityList: [],
  categoryList: Checkbox[],
  membershipsList: Checkbox[],
  c_memberships: string,
  c_category: string,
  c_memberships_other: string
};

export interface Checkbox
{
  id: string, 
  value: string
}
