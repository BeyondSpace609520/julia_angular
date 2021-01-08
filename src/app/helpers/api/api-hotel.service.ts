import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@/app/helpers/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiHotelService {

  constructor(private apiService: ApiService) {}

  public activateSara(customerId: number) {
    return this.apiService.hotelApiPost(
      customerId, {ss_newDesignReservation: 1}
    );
  }
  public hideSaraModal(customerId: number) {
    return this.apiService.hotelApiPost(
      customerId, {ss_hideCalltoActionModal: 1}
    );
  }
 
}
