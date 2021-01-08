import { Pipe, PipeTransform } from '@angular/core';

import { GuestDetail } from '../guest-information/models';

@Pipe({
  name: 'orderGuests'
})
export class OrderGuestsPipe implements PipeTransform {

  transform(guests: GuestDetail[], mainGuest?: GuestDetail): GuestDetail[] {
    if (!mainGuest) {
      return guests;
    }
    const otherGuests = guests.filter(g => g.id !== mainGuest.id);
    return [mainGuest, ...otherGuests];
  }

}
