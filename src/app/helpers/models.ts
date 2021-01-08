export enum ServiceState {
  Loading,
  Ready,
}

export interface AppVersion {
  version: string;
  short: string;
  long: string;
}

export type PrintPrepaymentParameter = 'on' | 'off' | 'RECEIPT';
