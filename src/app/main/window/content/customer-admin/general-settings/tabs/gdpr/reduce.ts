import {
  AutoAnonymizationSettings,
  RawAutoAnonymizationSettings
} from '@/app/main/window/content/customer-admin/general-settings/tabs/gdpr/models';

export function reduceAutoAnonymizationSettings(c: RawAutoAnonymizationSettings): AutoAnonymizationSettings {
  return {
    anonymizeIcal: c.c_anonymizeIcal === 'on',
    autoAnonymizationDays: +c.c_autoAnonymizationDays,
    autoAnonymize: c.c_autoAnonymize === '1',
    autoAnonymizeEmailToGuest: c.c_autoAnonymizeEmailToGuest === '1',
    hideAnonymizedGuests: c.c_hideAnonymizedGuests === '1'
  };
}
