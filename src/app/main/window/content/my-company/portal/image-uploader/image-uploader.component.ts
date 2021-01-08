import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { LoaderType } from '../loader-types';
import { PortalImage } from '../models';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.pug',
  styleUrls: ['./image-uploader.component.sass']
})
export class ImageUploaderComponent {

  @Input() image!: PortalImage;
  @Input() label!: string;
  @Output() update = new EventEmitter();

  constructor(
    private apiClient: ApiClient,
    private mainService: MainService,
    public loaderService: LoaderService
  ) { }

  get imageSrc() {
    return `${environment.mediaUrl}${this.image.url || '/wo/Services/images/0000000000_NoImage.jpg'}`;
  }


  @Loading(LoaderType.LOAD)
  async uploadImage() {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');
    const { dbName } = this.mainService.getCompanyDetails();

    if (file) {
      await this.apiClient.uploadPortalImage(this.image, file, dbName).toPromise();
      this.update.emit();
    }
  }

  @Loading(LoaderType.LOAD)
  async clearImage() {
    await this.apiClient.deletePortalImage(this.image).toPromise();
    this.update.emit();
  }
}
