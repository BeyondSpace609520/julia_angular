import { Component, } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';

export interface KeyValue {
  key: string;
  value: string;
}

export type InsuranceType = 'offerRequest' | 'offerResponse' | 'contractRequest' | 'contractResponse';

@Component({
  selector: 'app-key-value-modal',
  templateUrl: './key-value-modal.component.pug',
  styleUrls: ['./key-value-modal.component.sass']
})
export class KeyValueModalComponent  {

  items: KeyValue[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.KEY_VALUE);
  }

  @Loading(LoaderType.KEY_VALUE)
  public async load(id: number, type: InsuranceType): Promise<void> {
    this.items = await this.apiClient.getInsuranceInterface(id, type).toPromise();
  }
}
