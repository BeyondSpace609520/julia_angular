import { SugarAccountData } from '@/ui-kit/components/modals/gdpr-agreement/gdpr-agreement.model';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@/app/helpers/api/api.service';
import { ContractRenewalData, RawContractRenewalData, RecommendationRequest } from '@/ui-kit/components/modals/contract-renewal/models';
import { reduceContractRenewalData } from '@/ui-kit/components/modals/contract-renewal/reduce';
import { SugarNagScreenData } from '@/ui-kit/components/modals/sugar-data-nagscreen/sugar.data-nagscreen.model';

@Injectable({
  providedIn: 'root'
})
export class ApiSupportFormService {

  constructor(private apiService: ApiService) { }

  getContractRenewalData(): Observable<ContractRenewalData> {
    return this.apiService.easybookingGet<RawContractRenewalData>('apiSupportForm/sugarMasterOpp').pipe(
      map(reduceContractRenewalData)
    );
  }

  getSugarAccountData(databaseName: string): Observable<SugarAccountData> {
    return this.apiService.easybookingGet<SugarAccountData>('apiSupportForm/sugarAccount', undefined, databaseName);
  }

  sendGDPRAgreementContract(postData: {[field: string]: any}): Observable<void> {
    return this.apiService.easybookingPost<void>('apiSupportForm/setInfoForGDPR', postData);
  }

  sendRecommendation(data: RecommendationRequest): Observable<string> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data.hasOwnProperty(key)) {
        formData.set(key, data[key]);
      }
    });
    return this.apiService.easybookingPostText('apiSupportForm/recommendation', formData);
  }

  sendIBANValidation(iban: string): Observable<boolean> {
    const data = new FormData();
    data.set('iban', iban);
    return this.apiService.easybookingPost<{valid: string}>('apiSupportForm/validateIBAN', {data}).pipe(
      map(response => +response.valid === 1)
    );
  }

  getSugarNagScreenData(): Observable<SugarNagScreenData> {
    return this.apiService.easybookingGet<SugarNagScreenData>(`apiSupportForm/sugarDataNagScreen`);
  }

  saveSugarNagScreenData(postData: {[field: string]: any}): Observable<void> {
    return this.apiService.easybookingPost<void>(`apiSupportForm/sugarDataNagScreen`, postData);
  }
}
