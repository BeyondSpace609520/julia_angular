import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { FormDataService } from '@/app/main/shared/form-data.service';
import { CopyToSection, CopyToSectionItem } from '@/app/main/window/shared/copy-to/copy-to.component';
import { openCopyToModal } from '@/app/main/window/shared/copy-to/modal';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { EmailTemplateType } from '../../template-admin/models';
import { LoaderType } from '../loader-types';
import { FileEntity, Folder } from '../models';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.pug',
  styleUrls: ['./files.component.sass']
})
export class FilesComponent implements OnChanges {

  @Input() folder!: Folder;
  @Output() update = new EventEmitter();

  files: FileEntity[];
  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient,
    private mainService: MainService,
    private modal: ModalService,
    private formDataService: FormDataService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.TAB);
  }

  @Loading(LoaderType.TAB)
  async upload(): Promise<void> {
    const file = await selectFileDialog('');
    const { dbName } = this.mainService.getCompanyDetails();

    if (file) {
      await this.apiClient.uploadFileAdmin(this.folder.id, file, dbName).toPromise();
      this.update.emit();
    }
  }

  @Loading(LoaderType.TAB)
  async addToTemplate(file: FileEntity): Promise<void> {
    const templates = await this.apiClient.getEmailTemplates(EmailTemplateType.ALL).toPromise();
    const locals = this.formDataService.getLocals();
    const periods = await this.apiClient.getSeasonPeriods().toPromise();
    const linkedAttachments = await this.apiClient.getFileAdminAttachments(file.id).toPromise();
    const modal = openCopyToModal(this.modal, undefined, { title: 'BackEnd_WikiLanguage.FA_AddFileToTemplate' });

    const sections: CopyToSection[] = [
      {
        label: 'BackEnd_WikiLanguage.ET_EMailReason',
        items: templates.map(t => ({
          id: t.id,
          label: t.translation,
          checked: linkedAttachments.templateIds.includes(t.id)
        } as CopyToSectionItem))
      },
      {
        label: 'BackEnd_WikiLanguage.ET_EMailLocale',
        items: locals.map(l => ({
          id: l.value,
          label: `BackEnd_WikiLanguage.${l.name}`,
          checked: linkedAttachments.localeIds.includes(+l.value)
        } as CopyToSectionItem))
      },
      {
        label: 'BackEnd_WikiLanguage.ET_EMailSeasonPeriod',
        items: periods.map(p => ({
          id: p.id,
          label: p.name,
          checked: linkedAttachments.periodIds.includes(p.id)
      } as CopyToSectionItem))
      }
    ];

    modal.init({}, sections, async ([templateIds, localeIds, periodIds]) => {
      await this.apiClient.setFileAdminAttachments(file.id, { templateIds, localeIds, periodIds }).toPromise();
    });
  }

  downloadFile(file: FileEntity): void {
    window.open(file.urlToFile, '_blank');
  }

  @Loading(LoaderType.TAB)
  async deleteFile(file: FileEntity): Promise<void> {
    const confirmed = await this.modal.openConfirm(
      'BackEnd_WikiLanguage.FA_ConfirmDeleteFileMessageHeader',
      'BackEnd_WikiLanguage.FA_ConfirmDeleteFileMessage'
    );

    if (confirmed) {
      await this.apiClient.deleteFileAdmin(file.id).toPromise();
      this.load();
    }
  }

  @Loading(LoaderType.TAB)
  private async load(): Promise<void> {
    this.files = await this.apiClient.getFileAdminFiles(this.folder.id).toPromise();
  }

  ngOnChanges({ folder }: SimpleChanges) {
    if (folder && folder.currentValue !== folder.previousValue) {
      this.load();
    }
  }
}
