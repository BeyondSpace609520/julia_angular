import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Trigger } from '@/app/main/models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiBillingWorkbenchService {

  constructor(private apiService: ApiService) { }

  getCleanupChargeSeparateSetting(): Observable<boolean> {
    return this.apiService.mainApiPost<[Trigger]>(
      ['appUser'],
      'BillingWorkbench',
      'checkCleanupChargeSeparateSetting'
    ).pipe(
      map(value => !!value && value.length > 0 && value[0] === 'on')
    );
  }
}
