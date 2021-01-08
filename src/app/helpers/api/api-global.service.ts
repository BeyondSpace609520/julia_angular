import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '@/app/helpers/api/api.service';
import { ContractRenewalRequest } from '@/ui-kit/components/modals/contract-renewal/models';

@Injectable({
  providedIn: 'root'
})
export class ApiGlobalService {

  constructor(private apiService: ApiService) { }

  sendContractRenewal(data: ContractRenewalRequest): Observable<string> {
    return this.apiService.easybookingPostText('apiGlobal/contractRenewal', data);
  }
}
