import { AuthenticationResult, Customer, RawAuthenticationResult, RawCustomer } from './models';

export function reduceRawAuthenticationResult(rawResult: RawAuthenticationResult): AuthenticationResult {
  return {
    databases: reduceRawCustomers(rawResult.databases),
    hostname: rawResult.hostname,
    accessToken: rawResult.access_token,
    customerId: +rawResult.c_id,
    languageId: +rawResult.l_id,
    versionNumber: rawResult.versionNumber
  };
}

function reduceRawCustomers(rawCustomers: (RawCustomer | string)[]): Customer[] {
  if (!rawCustomers || rawCustomers.length === 0) {
    return [];
  }
  return rawCustomers.filter(customer => typeof customer !== 'string').map(customer => reduceRawCustomer(customer as RawCustomer));
}

export function reduceRawCustomer(rawCustomer: RawCustomer): Customer {
  return {
    databaseName: rawCustomer.aug_dbName,
    companyName: rawCustomer.aug_companyName,
    id: +rawCustomer.customer.c_id,
    postCode: rawCustomer.customer.c_postCode,
    city: rawCustomer.customer.c_city
  };
}
