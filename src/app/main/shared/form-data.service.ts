import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '../main.service';
import { CustomerFormResources } from '../window/shared/customer/form/models';

export interface FormOption<T = string> {
  value: T;
  name: string;
  disabled?: boolean;
}

export interface FormPaymentOption extends FormOption {
  isCreditCard: boolean;
}

@Injectable()
export class FormDataService {

  private pricingSchemes: FormOption[] | null = null;
  private pricingLangSchemes: FormOption[] | null = null;
  private customerFormResources: CustomerFormResources;

  constructor(
    private mainService: MainService,
    private apiClient: ApiClient
  ) { }

  getLocals(): FormOption[] {
    return this.mainService.getCompanyDetails().languagesDataProvider.map(l => ({
      value: l.l_id,
      name: l.l_desc
    }));
  }

  getDefaultLocale() {
    return this.mainService.getCompanyDetails().c_feLocale_id;
  }

  getCountries(): FormOption<number | null>[] {
    return this.mainService.getCompanyDetails().countryDataProvider.map(c => {
      const isEmpty =  !Boolean(c.cl_name);

      return {
        value: isEmpty ? null : +c.c_id,
        name: c.cl_name,
        disabled: !Boolean(c.cl_name) || c.cl_name.startsWith('---')
      };
    });
  }

  getDefaultCountry() {
    const details = this.mainService.getCompanyDetails();
    const empty = details.countryDataProvider.find(c => c.cl_name === '');

    if (!empty) { throw new Error('Cannot find a default county'); }

    return details.c_defaultCountry_id === empty.c_id || !details.c_defaultCountry_id ? null : details.c_defaultCountry_id;
  }

  getSalutations(locale?: AbstractControl): FormOption[] {
    const toOption = s => ({ value: s.s_id, name: s.displayField });
    const { standardSalutations, specialSalutations } = this.mainService.getCompanyDetails().salutationDropDown;

    return [...specialSalutations.filter(s => !locale || s.s_justFor_locale_id === locale.value), ...standardSalutations].map(toOption);
  }

  getDefaultSalutation() {
    return '';
  }

  normalizeSalutation(locale: AbstractControl, salutation: AbstractControl) {
    const list = this.getSalutations(locale);
    const optionStillExists = list.some(s => salutation.value === s.value);

    if (!optionStillExists) {
      const { standardSalutations, specialSalutations } = this.mainService.getCompanyDetails().salutationDropDown;
      const allSalutations = [...standardSalutations, ...specialSalutations];
      const previousSelectedSalutation = allSalutations.find(s => s.s_id === salutation.value);

      if (!previousSelectedSalutation) { throw new Error('previousSelectedSalutation not found'); }

      salutation.setValue(previousSelectedSalutation.s_mapsToStandard_salutation_id);
    }

    return list;
  }

  async getPaymentTypes(): Promise<FormPaymentOption[]> {
    const items = await this.apiClient.getPaymentTypes().toPromise();

    return items.map(item => ({
      name: item.bvptl_name as string,
      value: item.bvptl_billVersionPaymentType_id as string,
      isCreditCard: item.bvpt_isCreditCard === 'on'
    }));
  }

  async getRoomCategories(): Promise<FormOption[]> {
    const categories = await this.apiClient.getRoomCategories().toPromise();

    return categories.map(c => {
      const locale = c.locals.find(item => +item.localeId === +this.mainService.getCompanyDetails().c_beLocale_id);

      if (!locale) { throw new Error('locale not found'); }

      return {
        value: String(c.id),
        name: locale.title
      };
    });
  }

  async getPricingSchemes() : Promise<FormOption[][]> { // cached response
    if (!this.pricingSchemes || !this.pricingLangSchemes) {
      const response = await this.apiClient.getPricingSchemes().toPromise();
      this.pricingSchemes = response.map(item => ({ value: String(item.id), name: item.name }));
      this.pricingLangSchemes = response.map(item => ({ value: String(item.id), name: item.nameLang }));
    }

    return [this.pricingSchemes, this.pricingLangSchemes];
  }

  public async getCustomerFormResources(): Promise<CustomerFormResources> {
    if (this.customerFormResources) {
      return this.customerFormResources;
    }
    this.customerFormResources = await this.apiClient.getCustomerFormResources().toPromise();
    return this.customerFormResources;
  }
}
