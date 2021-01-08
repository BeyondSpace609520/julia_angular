import { InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

import { PictureEntity } from './models';

export interface PictureService<T> {
    getPictures(params: T): Observable<PictureEntity[]>;
    updatePicture(params: T, picture: PictureEntity): Observable<unknown>;
    deletePicture(params: T, id: PictureEntity['id']): Observable<unknown>;
    uploadPicture(params: T, file: File, db: string): Observable<unknown>;
}

export const PICTURE_PROVIDER = new InjectionToken<PictureService<unknown>>('PictureService');
