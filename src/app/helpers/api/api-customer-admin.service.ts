import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormOption } from '../../main/shared/form-data.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCustomerAdminService {

  constructor(private apiService: ApiService) { }

  getCustomerHotelOptions(): Observable<FormOption<number>[]> {
    return this.apiService.mainApiPost<{ hs_id: string; hs_name: string; }[]>([], 'CustomerAdmin', 'getHotelSoftwareList').pipe(
      map(list => list.map(item => ({ value: +item.hs_id, name: item.hs_name })))
    );
  }

  getCustomerResellerOptions(): Observable<FormOption<number>[]> {
    return this.apiService.mainApiPost<{ r_id: string;  r_companyName: string; }[]>([], 'CustomerAdmin', 'getResellerList').pipe(
      map(list => list.map(item => ({ value: +item.r_id, name: item.r_companyName })))
    );
  }

  getCustomerStatusOptions(): Observable<FormOption<number>[]> {
    return this.apiService.mainApiPost<{ cs_id: string; cs_name: string; }[]>([], 'CustomerAdmin', 'getCustomerStatus').pipe(
      map(list => list.map(item => ({ value: +item.cs_id, name: item.cs_name })))
    );
  }
}
