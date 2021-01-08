import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiILogCalendarService {

  constructor(private apiService: ApiService) { }

  public getCityFromPostCode(dbName: string, countryId: number, postCode: string): Observable<string[]> {
    return this.apiService.mainApiPost<{pc_id: string, postcode: string, pc_city: string}[]>(
      [postCode, countryId, dbName],
      'ILogCalendar',
      'getCityFromPostcode'
    ).pipe(
      map(result => result.map(postCodeCity => postCodeCity.pc_city))
    );
  }
}
