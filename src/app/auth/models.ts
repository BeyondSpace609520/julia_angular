export interface AuthenticationRequest {
  username: string;
  password: string;
  database?: string;
  target?: 'angular' | 'standalone';
  hostname?: string;
}

export interface RawAuthenticationResult {
  databases: (RawCustomer | string)[];
  hostname: string;
  query: string;
  path: string;
  c_id: string;
  l_id: string;
  versionNumber: string;
  access_token: string;
  juliaAngularIndicator: boolean;
  url: string;
}

export interface AuthenticationResult {
  databases: Customer[];
  hostname: string;
  customerId: number;
  languageId: number;
  versionNumber: string;
  accessToken: string;
}

export interface RawCustomer {
  aug_dbName: string;
  aug_companyName: string;
  customer: {
    c_id: string,
    c_postCode: string,
    c_city: string
  };
}

export interface Customer {
  id: number;
  databaseName: string;
  companyName: string;
  postCode: string;
  city: string;
}

export interface User {
  username: string;
  database: string;
  hotelName: string;
  databases?: Customer[];
}
