import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { HotelRegistrationRecord } from '@/app/main/window/content/customer-admin/guest-registration/models';

@Pipe({
  name: 'selectedHotelRecord'
})
export class SelectedHotelRecordPipe implements PipeTransform {
  transform(hotels: HotelRegistrationRecord[], hotelId: number): HotelRegistrationRecord | null {
    return (hotelId && hotels.find((r) => r.id === +hotelId)) || null;
  }
}
