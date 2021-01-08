import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { selectFileDialog } from '../forms/file-dialog';
import { LoaderType } from './loader-type';
import { LayoutSource } from './models';

@Component({
  selector: 'app-layout-uploader',
  templateUrl: './layout.component.pug',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent implements OnChanges {

  @Input() id!: number;
  @Input() source!: LayoutSource;
  @Output() saved = new EventEmitter();

  imageSrc: string;
  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private mainService: MainService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LAYOUT_UPLOAD);
  }

  @Loading(LoaderType.LAYOUT_UPLOAD)
  async refresh(): Promise<void> {
    this.imageSrc = environment.mediaUrl + await this.apiClient.loadLayoutImage(this.id, this.source).toPromise();
  }

  @Loading(LoaderType.LAYOUT_UPLOAD)
  async upload(): Promise<void> {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');
    const db = this.mainService.getCompanyDetails().dbName;

    if (file) { // TODO
      await this.apiClient.uploadLayoutPicture(this.id, file, db, this.source).toPromise();
      this.saved.emit();
      await this.refresh();
    }
  }

  @Loading(LoaderType.LAYOUT_UPLOAD)
  async remove(): Promise<void> {
    await this.apiClient.removeImage(this.id, this.source).toPromise();
    await this.refresh();
  }

  ngOnChanges(): void {
    this.refresh();
  }
}
