import { Component } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { openInsertModal } from '@/app/main/window/shared/insert-modal/insert-modal';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { VisitReason } from '../../models';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.pug',
  styleUrls: ['./travel.component.sass']
})
export class TravelComponent {

  public reasons: VisitReason[] = [];
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private modalService: ModalService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.TRAVEL);
  }

  @Loading(LoaderType.TRAVEL)
  public async load(langId: number): Promise<void> {
    this.reasons = await this.apiClient.getVisitReasons(langId).toPromise();
  }

  @Loading(LoaderType.TRAVEL)
  public async save(langId: number): Promise<void> {
    await this.apiClient.saveVisitReasons(this.reasons, langId).toPromise();
  }

  public deleteItem(reason: VisitReason): void {
    if (reason.used === 'on') {
      this.modalService.openSimpleText('BackEnd_WikiLanguage.MW_AlertCantDelete');
      return;
    }

    this.reasons.splice(this.reasons.indexOf(reason), 1);
  }

  public addItem(langId: number): void {
    openInsertModal(
      this.modalService,
      'BackEnd_WikiLanguage.MW_newMotif',
      'BackEnd_WikiLanguage.MW_ConfigName',
      async (name: string) => {
        await this.apiClient.newVisitReason(name).toPromise();
        await this.load(langId);

        return true;
      }
    );
  }
}
