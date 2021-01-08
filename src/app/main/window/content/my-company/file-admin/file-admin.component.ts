import { Component, OnInit } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { openInsertModal } from '../../../shared/insert-modal/insert-modal';
import { LoaderType } from './loader-types';
import { Folder } from './models';

@Component({
  selector: 'app-file-admin',
  templateUrl: './file-admin.component.pug',
  styleUrls: ['./file-admin.component.sass']
})
export class FileAdminComponent implements OnInit {

  tree: Folder[] = [];
  selected: Folder | null = null;
  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient,
    private modal: ModalService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  async load(selectItemId?: number): Promise<void> {
    this.tree = await this.apiClient.getFileAdminFolders().toPromise();
    if (!selectItemId && this.selected) {
      selectItemId = this.selected.id;
    }
    this.selectItem(selectItemId ? this.findFolder(this.tree, selectItemId) : null);
  }

  selectItem(item: Folder | null): void {
    this.selected = item;
  }

  addFolder(parentFolder: Folder): void {
    openInsertModal(this.modal, 'BackEnd_WikiLanguage.FA_NewFolder', 'BackEnd_WikiLanguage.FA_FolderName', async name => {
      const newFolderId = await this.apiClient.createFileAdminFolder(name, parentFolder.id).toPromise();
      this.load(+newFolderId.fo_id);
      return true;
    });
  }

  renameFolder(folder: Folder): void {
    openInsertModal(this.modal, 'BackEnd_WikiLanguage.FA_RenameFolder', 'BackEnd_WikiLanguage.FA_FolderName', async name => {
      await this.apiClient.renameFileAdminFolder(name, folder.id).toPromise();
      this.load();
      return true;
    }, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Save',
      value: folder.name
    });
  }

  @Loading(LoaderType.TAB)
  async deleteFolder(folder: Folder): Promise<void> {
    await this.apiClient.deleteFileAdminFolder(folder.id).toPromise();
    this.load();
  }

  refreshTree(): void {
    this.load();
    this.selectItem(null);
  }

  private findFolder(list: Folder[], id: Folder['id']): Folder | null {
    for (const folder of list) {
      if (folder.id === id) {
        return folder;
      }
      const f = this.findFolder(folder.children, id);

      if (f) {
        return f;
      }
    }
    return null;
  }

  ngOnInit(): void {
    this.load();
  }

}
