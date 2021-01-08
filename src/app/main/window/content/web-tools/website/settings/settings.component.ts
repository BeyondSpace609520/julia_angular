import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { PictureEntity } from '@/app/main/window/shared/image-selector/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';

enum LoaderType {
  LOAD = 'load-website-settings'
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.pug',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  picture?: PictureEntity;
  isLoading: Observable<boolean>;

  // TODO replace getter function with pipe or static variable
  get imageSrc() {
    return `${environment.mediaUrl}${this.picture && this.picture.path || '/wo/Services/images/0000000000_NoImage.jpg'}`;
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private mainService: MainService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  async load(): Promise<void> {
    this.picture = (await this.apiClient.getWebsitePictures('logo').toPromise())[0];
  }

  @Loading(LoaderType.LOAD)
  async uploadImage(): Promise<void> {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');
    const { dbName } = this.mainService.getCompanyDetails();

    if (file) {
      await this.apiClient.uploadWebsitePicture('logo', file, dbName).toPromise();
      this.load();
    }
  }

  @Loading(LoaderType.LOAD)
  async clearImage(): Promise<void> {
    if (this.picture) {
      await this.apiClient.deleteWebsitePicture(this.picture.id, 'logo').toPromise();
      this.load();
    }
  }

  ngOnInit(): void {
    this.load();
  }
}
