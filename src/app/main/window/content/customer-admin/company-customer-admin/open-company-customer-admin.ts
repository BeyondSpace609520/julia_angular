import { ViewService } from '@/app/main/view/view.service';

export function openCompanyCustomerAdmin(viewService: ViewService, properties?: CompanyCustomerAdminProperties): void {
  if (properties && properties.customerId && isNaN(properties.customerId)) {
    properties.customerId = undefined;
  }
  viewService.openViewWithProperties('companyCustomerAdmin', properties || {});
}

export interface CompanyCustomerAdminProperties {
  customerId?: number;
}
