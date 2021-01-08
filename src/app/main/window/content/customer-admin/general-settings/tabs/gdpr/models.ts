import { Trigger } from '@/app/main/models';

export interface RawAutoAnonymizationSettings {
  c_anonymizeIcal: Trigger;
  c_autoAnonymizationDays: string;
  c_autoAnonymize: string;
  c_autoAnonymizeEmailToGuest: string;
  c_hideAnonymizedGuests: string;
}

export interface AutoAnonymizationSettings {
  anonymizeIcal: boolean;
  autoAnonymizationDays: number;
  autoAnonymize: boolean;
  autoAnonymizeEmailToGuest: boolean;
  hideAnonymizedGuests: boolean;
}
