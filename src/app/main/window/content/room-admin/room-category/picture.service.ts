import { Injectable } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { PictureService as IPictureService } from '../../../shared/image-selector/injection';
import { PictureEntity } from '../../../shared/image-selector/models';

type Params = { id: number };

@Injectable()
export class PictureService implements IPictureService<Params> {
    constructor(private apiClient: ApiClient) {}

    getPictures({ id }: Params) {
        return this.apiClient.getPictures(id, 'category');
    }

    updatePicture({ id }: Params, picture: PictureEntity) {
        return this.apiClient.updatePicture(picture, 'category');
    }

    deletePicture({ id }: Params, pictureId: PictureEntity['id']) {
        return this.apiClient.deletePicture(pictureId, 'category');
    }

    uploadPicture({ id }: Params, file: File, db: string) {
        return this.apiClient.uploadPicture(id, file, db, 'category');
    }
}
