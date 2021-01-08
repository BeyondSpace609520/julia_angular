import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalRoomCategory, RawLocalRoomCategory } from '@/app/main/window/content/services/special-offers/models';
import { reduceLocalRoomCategory } from '@/app/main/window/content/services/special-offers/reduce';
import { CompanyDetails } from '../../main/models';
import { FormOption } from '../../main/shared/form-data.service';
import { RawCentralSalutation } from '../../main/window/content/administration/customers/models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiAppService {

  constructor(private apiService: ApiService) { }

  public getCompanyDetails(): Observable<CompanyDetails> {
    return this.apiService.mainApiPost<CompanyDetails>([ 'appUser', true ], 'AppClass', 'getCompanyDetails');
  }

  public getLocalRoomCategories(): Observable<LocalRoomCategory[]> {
    return this.apiService.mainApiPost<RawLocalRoomCategory[]>(['appUser'], 'AppClass', 'getEntityGroup').pipe(map(categories => categories.map(reduceLocalRoomCategory)));
  }

  public getCentralSalutations(): Observable<FormOption<number>[]> {
    const toOption = (s) => ({ value: s.s_id, name: s.s_name });
    return this.apiService.mainApiPost<RawCentralSalutation[]>([], 'AppClass', 'getCentralSalutation').pipe(
      map(list => list.map(toOption))
    );
  }
}
