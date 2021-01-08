import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { PictureService as IPictureService } from '../../../shared/image-selector/injection';
import { PictureEntity } from '../../../shared/image-selector/models';
import { WebsitePictureSource } from './models';

type Params = { source: WebsitePictureSource };

@Injectable()
export class PictureService implements IPictureService<Params> {
  constructor(private apiClient: ApiClient) {}

  public getPictures({ source }: Params): Observable<PictureEntity[]> {
    return this.apiClient.getWebsitePictures(source);
  }

  public updatePicture({ source }: Params, picture: PictureEntity): Observable<number[]> {
    return this.apiClient.updateWebsitePicture(picture, source);
  }

  public deletePicture({ source }: Params, pictureId: PictureEntity['id']): Observable<void> {
    return this.apiClient.deleteWebsitePicture(pictureId, source);
  }

  public uploadPicture({ source }: Params, file: File, db: string): Observable<string> {
    return this.apiClient.uploadWebsitePicture(source, file, db);
  }
}
