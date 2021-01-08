import { validateTravelDocument } from '@/app/helpers/validation';
import { ViewService } from '@/app/main/view/view.service';
import { FieldKeys } from '../../../shared/customer/form/fields';
import { Guest } from '../customer-more-information/models';
import { HotelRegistrationRecord } from '../guest-registration/models';
import { GuestDetail } from './models';

export enum ValidationLevel {
  Basic = 'basic',
  Strict = 'strict',
  Full = 'full'
}

export interface GuestInformationProps {
  bookingId: number;
  hotel?: HotelRegistrationRecord;
  preselectGuestId?: Guest['id'];
  baseValidation?: ValidationLevel;
  mainGuestId?: Guest['id'];
}

const guestValidationFieldsBasic: FieldKeys<GuestDetail>[] = ['firstName', 'lastName', 'birthday'];
const guestValidationFieldsStrict: FieldKeys<GuestDetail>[] = [...guestValidationFieldsBasic, 'postCode'];
const guestValidationFieldsFull: FieldKeys<GuestDetail>[] = [...guestValidationFieldsStrict, 'city', 'nationalityId'];
const guestValidationFieldsFullWithDocumentNo: FieldKeys<GuestDetail>[] = [...guestValidationFieldsFull, 'documentNo'];

export function getGuestValidationFields(
  level: ValidationLevel | undefined,
  guestCountryId: number | null,
  customerCountryId: number,
): FieldKeys<GuestDetail>[] {
  switch (level) {
    case ValidationLevel.Full:
      if (validateTravelDocument(customerCountryId, guestCountryId)) {
        return guestValidationFieldsFull;
      } else {
        return guestValidationFieldsFullWithDocumentNo;
      }
    case ValidationLevel.Strict: return guestValidationFieldsStrict;
    case ValidationLevel.Basic: return guestValidationFieldsBasic;
    default: return [];
  }
}

export function openGuestInformation(
  viewService: ViewService,
  {hotel, bookingId, preselectGuestId, baseValidation, mainGuestId}: GuestInformationProps,
  onGuestSaved?: (guest: GuestDetail) => void
) {
  viewService.focusViewWithProperties(
    'guestInformation',
    {hotel, bookingId, preselectGuestId, baseValidation, mainGuestId, onGuestSaved}
  );
}
