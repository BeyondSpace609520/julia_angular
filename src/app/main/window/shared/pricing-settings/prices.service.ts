import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-type';
import { CateringEntity, PricingEntity, ServiceType } from './models';

@Injectable()
export class PricesService {

  serviceTypes$: BehaviorSubject<ServiceType[]> = new BehaviorSubject([]);

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) {
    this.loadServiceTypes();
  }

  @Loading(LoaderType.PRICING)
  private async loadServiceTypes() {
    this.serviceTypes$.next(await this.apiClient.getActiveServiceType().toPromise());
  }

  getCateringName(item: CateringEntity) {
    return this.serviceTypes$.pipe(
      map(list => list.find(st => st.id === item.typeId)),
      map(type => type && type.name)
    );
  }

  calculateAgesPrice(entity: PricingEntity, from: number, to: number) {
    return entity.ages.reduce((acc, rule) => acc + (rule.from === from && rule.to === to ? rule.price : 0), 0);
  }
}
