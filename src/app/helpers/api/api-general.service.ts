import { Injectable } from '@angular/core';

import { ApiService } from '@/app/helpers/api/api.service';
import { GDPRAgreementContract } from '@/ui-kit/components/modals/gdpr-agreement/gdpr-agreement.model';

@Injectable({
  providedIn: 'root'
})
export class ApiGeneralService {

  constructor(private apiService: ApiService) { }

  getGDPRAgreementContract(parameters: {[key: string]: string | number}) {
    return this.apiService.easybookingGet<GDPRAgreementContract>('api/LegalDocument', parameters);
  }

}
