import { Component } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-type';
import { RoomsValidationResponse } from '../../models';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.pug',
  styleUrls: ['./license.component.sass']
})
export class LicenseComponent {

  data: RoomsValidationResponse;
  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private modal: ModalService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MODAL);
  }

  init(data: RoomsValidationResponse): void {
    this.data = data;
  }

  @Loading(LoaderType.MODAL)
  async sendEmail(): Promise<void> {
    await this.apiClient.sendEmailAboutRoomLicense(this.data.maxRooms, this.data.currentRooms).toPromise();
  }

  async submit(): Promise<void> {
    const confimed = await this.modal.openConfirm('BackEnd_WikiLanguage.contactEBSalesQuestion');

    if (confimed) {
      await this.sendEmail();
      this.modal.openSimpleText('BackEnd_WikiLanguage.emailAboutBedLicenseInfo');
    }
  }
}
