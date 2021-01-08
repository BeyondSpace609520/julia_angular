import { Component } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { openInsertModal } from '@/app/main/window/shared/insert-modal/insert-modal';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { DocumentType } from '../../models';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.pug',
  styleUrls: ['./identification.component.sass']
})
export class IdentificationComponent {

  public documentTypes: DocumentType[] = [];
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private modalService: ModalService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.IDENT);
  }

  @Loading(LoaderType.IDENT)
  public async load(langId: number): Promise<void> {
    this.documentTypes = await this.apiClient.getDoctypes(langId).toPromise();
  }

  @Loading(LoaderType.IDENT)
  public async save(langId: number): Promise<void> {
    await this.apiClient.saveDoctypes(this.documentTypes, langId).toPromise();
  }

  public deleteItem(doctype: DocumentType): void {
    if (doctype.used === 'on') {
      this.modalService.openSimpleText('BackEnd_WikiLanguage.MW_AlertCantDelete');
      return;
    }

    this.documentTypes.splice(this.documentTypes.indexOf(doctype), 1);
  }

  public addItem(langId: number): void {
    openInsertModal(
      this.modalService,
      'BackEnd_WikiLanguage.MW_newDocumentType',
      'BackEnd_WikiLanguage.MW_ConfigName',
      async (name: string) => {
        await this.apiClient.newDoctype(name).toPromise();
        await this.load(langId);

        return true;
      }
    );
  }
}
