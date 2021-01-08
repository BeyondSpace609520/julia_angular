import { RawCustomer } from '@/app/auth/models';

export interface AuthCheck {
  status: string;
  databases?: RawCustomer[];
}
