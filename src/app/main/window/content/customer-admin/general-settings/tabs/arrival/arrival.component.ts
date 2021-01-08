import { Component } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { openInsertModal } from '@/app/main/window/shared/insert-modal/insert-modal';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { Arrival } from '../../models';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.pug',
  styleUrls: ['./arrival.component.sass']
})
export class ArrivalComponent {

  public arrivals: Arrival[] = [];
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private modalService: ModalService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.ARRIVAL);
  }

  @Loading(LoaderType.ARRIVAL)
  public async load(langId: number): Promise<void> {
    this.arrivals = await this.apiClient.getArrivals(langId).toPromise();
  }

  @Loading(LoaderType.ARRIVAL)
  public async save(langId: number): Promise<void> {
    await this.apiClient.saveArrivals(this.arrivals, langId).toPromise();
  }

  public deleteItem(reason: Arrival): void {
    if (reason.used === 'on') {
      this.modalService.openSimpleText('BackEnd_WikiLanguage.MW_AlertCantDelete');
      return;
    }

    this.arrivals.splice(this.arrivals.indexOf(reason), 1);
  }

  public addItem(langId: number): void {
    openInsertModal(
      this.modalService,
      'BackEnd_WikiLanguage.MW_newArrivalType',
      'BackEnd_WikiLanguage.MW_ConfigName',
      async (name: string) => {
        await this.apiClient.newArrival(name).toPromise();
        await this.load(langId);
        return true;
      }
    );
  }
}
