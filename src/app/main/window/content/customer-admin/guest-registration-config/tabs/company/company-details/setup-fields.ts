import { HotelRegistrationRecord } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { Providers } from '../../../../create-registration-form/consts';
import { ReportingClientProvider } from '../../../models';
import { MainFieldSettings } from './company-details.component';

export function setupFields(
  providers: ReportingClientProvider[],
  guestRegistrationProviderId: HotelRegistrationRecord['guestRegistrationProviderId'] | undefined,
  isAdmin: boolean,
): MainFieldSettings[][] {
  return [
    [
      {
        name: 'name',
        label: 'BackEnd_WikiLanguage.MW_Hotelname',
        type: 'text',
      },
      {
        name: 'guestRegistrationProviderId',
        label: 'BackEnd_WikiLanguage.MW_ProviderLabel',
        type: 'select',
        selectOptions: providers,
        disabled: !isAdmin,
      },
      {
        name: 'desklineEditionV3',
        label: 'V3.0',
        isLabelStatic: true,
        type: 'checkbox',
      },
      {
        name: 'alternativeProviderLink',
        label: 'BackEnd_WikiLanguage.providerLink',
        type: 'text',
      },
    ],
    [
      {
        name: 'mcNumber',
        label:
          guestRegistrationProviderId === Providers.AVS
            ? 'BackEnd_WikiLanguage.avs_ObjectId'
            : 'BackEnd_WikiLanguage.MW_ConfigMCNumber',
        type: 'text',
      },
      {
        name: 'username',
        label: 'BackEnd_WikiLanguage.MW_ConfigUser',
        type: 'text',
      },
      {
        name: 'password',
        label: 'BackEnd_WikiLanguage.MW_ConfigPassword',
        type: 'password',
      },
      {
        name: 'communityNumber',
        label:
          guestRegistrationProviderId === Providers.AVS
            ? 'BackEnd_WikiLanguage.avs_CommunityId'
            : 'BackEnd_WikiLanguage.MW_ConfigCommunityNumber',
        type: 'text',
      },
      {
        name: 'businessIndicator',
        label:
          guestRegistrationProviderId === Providers.AVS
            ? 'BackEnd_WikiLanguage.avs_CompanyId'
            : 'BackEnd_WikiLanguage.MW_ConfigBusinessIndicator',
        type: 'text',
      },
      {
        name: 'clientCode',
        label: 'BackEnd_WikiLanguage.MW_Client',
        type: 'text',
        extraField: {
          name: 'code',
          type: 'text',
        },
      },
    ],
    [
      {
        name: 'advanceBookingPossible',
        label: 'BackEnd_WikiLanguage.MW_PrepareFormsPossible',
        type: 'checkbox',
        disabled: true,
      },
      {
        name: 'guestCardSeparate',
        label: 'BackEnd_WikiLanguage.guestCardSeparate',
        type: 'checkbox',
      },
      {
        name: 'emailToFeratel',
        label: 'BackEnd_WikiLanguage.emailToFeratelLabel',
        type: 'checkbox',
        tooltip: 'BackEnd_WikiLanguage.emailToFeratelInfo',
      },
    ],
  ];
}
