import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-type';
import { RoomListItem } from '../models';

@Component({
  selector: 'app-edit-separator',
  templateUrl: './edit-separator.component.pug',
  styleUrls: ['./edit-separator.component.sass']
})
export class EditSeparatorComponent implements OnChanges {

  @Input() selectedItem!: RoomListItem;
  @Output() edited = new EventEmitter();

  sortOrderControl = new FormControl();

  constructor(
    public loaderService: LoaderService,
    private apiClient: ApiClient
  ) { }

  ngOnChanges({ selectedItem }: SimpleChanges) {
    if (selectedItem && selectedItem.currentValue !== selectedItem.previousValue) {
      this.sortOrderControl.setValue(this.selectedItem.sortOrder);
    }
  }

  @Loading(LoaderType.APARTMENTS)
  async saveSeparator() {
    await this.apiClient.putSeparator(this.selectedItem.id, this.sortOrderControl.value).toPromise();
    this.edited.emit();
  }
}
