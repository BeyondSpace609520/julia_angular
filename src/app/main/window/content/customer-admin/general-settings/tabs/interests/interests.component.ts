import { Component, OnInit } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { openInsertModal } from '@/app/main/window/shared/insert-modal/insert-modal';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { Characteristic } from '../../models';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.pug',
  styleUrls: ['./interests.component.sass']
})
export class InterestsComponent {

  public characteristics: Characteristic[];
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.INTERESTS);
  }

  @Loading(LoaderType.INTERESTS)
  public async loadCharacteristics(langId: number): Promise<void> {
    this.characteristics = await this.apiClient.getCharacteristics(langId).toPromise();
  }

  public deleteItem(characteristic: Characteristic): void {
    if (characteristic.used === 'on') {
      this.modalService.openSimpleText('BackEnd_WikiLanguage.MW_AlertCantDelete');
      return;
    }

    this.characteristics.splice(this.characteristics.indexOf(characteristic), 1);
  }

  @Loading(LoaderType.INTERESTS)
  public async save(langId: number): Promise<void> {
    await this.apiClient.saveCharacteristics(this.characteristics, langId).toPromise();
  }

  public addItem(langId: number): void {
    openInsertModal(
      this.modalService,
      'BackEnd_WikiLanguage.MW_NewCharacteristic',
      'BackEnd_WikiLanguage.MW_ConfigName',
      async (name: string) => {
        await this.apiClient.newCharacteristic(name).toPromise();
        await this.loadCharacteristics(langId);

        return true;
      }
    );
  }
}
