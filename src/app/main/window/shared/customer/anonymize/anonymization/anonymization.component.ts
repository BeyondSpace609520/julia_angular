import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { CustomerConfirmParams } from '../../anonymize/models';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-anonymization',
  templateUrl: './anonymization.component.pug',
  styleUrls: ['./anonymization.component.sass']
})
export class AnonymizationComponent {

  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MODAL);
  }

  @Loading(LoaderType.MODAL)
  public async save(customerId: number): Promise<CustomerConfirmParams> {
    return await this.apiClient.anonymizeCustomer(customerId).toPromise();
  }
}
