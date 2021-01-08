import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Editor } from '../edit/types';
import { LoaderType } from '../loader-type';
import { CateringSchemeType, ChargingSchemeTypeRecord } from '../models';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.pug',
  styleUrls: ['./new.component.sass']
})
export class NewChargingComponent implements OnInit {

  @Output() valid = new EventEmitter<boolean>();

  selectedType: CateringSchemeType;
  types: ChargingSchemeTypeRecord[];
  editor: Editor;
  isLoading: Observable<boolean>;

  @ViewChild('editor', { static: false }) set editorRef(ref: Editor) {
    if (!ref) {
      return;
    }
    this.editor = ref;
    this.editor.isValid().pipe(takeWhile(() => ref === this.editor)).subscribe(v => this.valid.emit(v));
  }

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MANAGE);
  }

  @Loading(LoaderType.MANAGE)
  public async save(): Promise<number | null> {
    const type = this.types.find(t => t.value === this.selectedType);

    if (!type) { throw new Error('Base type not found'); }

    return await this.apiClient.saveChargingScheme(this.editor.extract(), type.id).toPromise();
  }

  @Loading(LoaderType.MANAGE)
  async ngOnInit(): Promise<void> {
    this.types = await this.apiClient.getActiveChargingSchemes().toPromise();
  }
}
