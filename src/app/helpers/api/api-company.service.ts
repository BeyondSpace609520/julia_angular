import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, reduce } from 'rxjs/operators';

import { BlockDates, RawBlockDates } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { inverseReduceBlockDates, reduceBlockDates } from '@/app/main/window/content/pricing-admin/season-periods/reduce';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiCompanyService {
  constructor(private apiService: ApiService) {}

  public getGeneralSettings(): Observable<BlockDates> {
    return this.apiService
      .mainApiPost<RawBlockDates>(
        ['appUser'],
        'GeneralSettings',
        'getGeneralSettings'
      )
      .pipe(map(reduceBlockDates));
  }

  public setGeneralSettings(blockDates: BlockDates): Observable<void> {
    const rawblockDates = blockDates && inverseReduceBlockDates(blockDates);
    return this.apiService.mainApiPost<void>(
      [rawblockDates, 'appUser'],
      'GeneralSettings',
      'setGeneralSettings'
    );
  }

}
