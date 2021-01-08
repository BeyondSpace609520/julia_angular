export interface MultiUserCreateResponse {
  status: MultiUserCreateStatus;
  message: string;
}

export type MultiUserCreateStatus = 'OK' | 'ERROR';
