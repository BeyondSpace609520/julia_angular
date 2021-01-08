import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MainService } from '@/app/main/main.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { selectFileDialog } from '../forms/file-dialog';
import { PICTURE_PROVIDER, PictureService } from './injection';
import { PictureEntity } from './models';

export enum LoaderType {
  IMAGE_SELECTOR = 'image-selector'
}

const maxFileSize: number = 10 * 1024 * 1024;

@Component({
  selector: 'app-category-images-selector',
  templateUrl: './pictures.component.pug',
  styleUrls: ['./pictures.component.sass']
})
export class PicturesComponent<T> implements OnChanges, OnDestroy {

  @Input() params!: T; // entity id
  @Input() showTagField: boolean;
  @Output() saved = new EventEmitter();

  pictures: PictureEntity[];
  current = new BehaviorSubject<PictureEntity | null>(null);
  sortOrderControl = new FormControl(1);
  imageTagControl = new FormControl('');
  form: FormGroup;
  isLoading: Observable<boolean>;

  constructor(
    @Inject(PICTURE_PROVIDER) private pictureService: PictureService<T>,
    private modal: ModalService,
    private loaderService: LoaderService,
    private mainService: MainService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.IMAGE_SELECTOR);
    this.form = new FormGroup({
      sortOrder: this.sortOrderControl,
      tag: this.imageTagControl
    });
    this.current.pipe(untilDestroyed(this)).subscribe((current) => {
      this.form.reset();
      this.sortOrderControl.setValue(current ? current.sortOrder : 0);
      this.imageTagControl.setValue(current ? current.tag : '');
    });
  }

  @Loading(LoaderType.IMAGE_SELECTOR)
  async loadPictures(): Promise<void> {
    this.pictures = await this.pictureService.getPictures(this.params).pipe(
      map(list =>
        [...list].map(item => ({ ...item, path: environment.mediaUrl + item.path})).sort((a, b) => a.sortOrder - b.sortOrder)
        )
    ).toPromise();
    this.selectPicture(this.pictures[0]);
  }

  selectPicture(picture: PictureEntity): void {
    if (this.current.value === picture) { return; }

    this.current.next(picture);
  }

  @Loading(LoaderType.IMAGE_SELECTOR)
  async save(): Promise<void> {
    const data: PictureEntity = {
      ...(this.current.value as PictureEntity),
      sortOrder: this.sortOrderControl.value,
      tag: this.imageTagControl.value
    };
    await this.pictureService.updatePicture(this.params, data).toPromise();
    await this.loadPictures();
    this.saved.emit();
  }

  async delete(): Promise<void> {
    // tslint:disable-next-line: max-line-length
    const confirmed = await this.modal.openConfirm('BackEnd_WikiLanguage.CS_ConfirmDeleteACSMessageHeader', 'BackEnd_WikiLanguage.EGP_MSGDeletePic');

    if (confirmed) {
      await this.confirmDeletion();
      this.saved.emit();
    }
  }

  @Loading(LoaderType.IMAGE_SELECTOR)
  async confirmDeletion(): Promise<void> {
    if (!this.current.value) { throw new Error('Current picture entity not found'); }

    await this.pictureService.deletePicture(this.params, this.current.value.id).toPromise();
    await this.loadPictures();
  }

  @Loading(LoaderType.IMAGE_SELECTOR)
  async newPicture(): Promise<void> {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');

    if (!file) { return; }

    const db = this.mainService.getCompanyDetails().dbName;

    if (file.size >= maxFileSize) {
      this.modal.openSimpleText('BackEnd_WikiLanguage.EGP_MSGImgTooBigHeader', 'BackEnd_WikiLanguage.EGP_MSGImgTooBig');
      return;
    }

    await this.pictureService.uploadPicture(this.params, file, db).toPromise();
    await this.loadPictures();
    this.saved.emit();
  }

  ngOnChanges({ params }: SimpleChanges): void {
    if (params && params.previousValue !== params.currentValue) {
      this.loadPictures();
    }
  }

  ngOnDestroy(): void {}
}
