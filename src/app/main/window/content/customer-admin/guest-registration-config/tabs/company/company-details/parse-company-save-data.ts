import { HotelRegistrationRecord } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { CompanyDetailsFormValues, CompanyDetailsSaveData } from '../../../models';
import { isFieldVisible } from './is-field-visible.pipe';

export function parseCompanySaveData(values: CompanyDetailsFormValues, hotelId: HotelRegistrationRecord['id']): CompanyDetailsSaveData {
  return {
    cf_desklineEdition: values.desklineEditionV3 ? 'on' : 'off',
    grp_id: values.guestRegistrationProviderId,
    rfgs_altLink: values.alternativeProviderLink,
    rfgs_businessIndicator: values.businessIndicator,
    rfgs_clientCode: values.clientCode,
    rfgs_code: values.code,
    rfgs_communityNumber: values.communityNumber,
    rfgs_emailToFeratel: values.emailToFeratel ? 'on' : 'off',
    rfgs_guestCardSeparate: values.guestCardSeparate ? 'on' : 'off',
    rfgs_id: hotelId,
    rfgs_mcNumber: values.mcNumber,
    rfgs_name: values.name,
    rfgs_password: values.password,
    rfgs_username: values.username,
    saveDesklineEdition: isFieldVisible('desklineEditionV3', values.guestRegistrationProviderId, values.desklineEditionV3) ? 'on' : 'off'
  };
}
