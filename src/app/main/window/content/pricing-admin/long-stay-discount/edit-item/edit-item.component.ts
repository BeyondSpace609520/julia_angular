import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { Discount } from '@/app/main/window/shared/discount/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { LongStayDiscountDetail } from '../models';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.pug',
  styleUrls: ['./edit-item.component.sass']
})
export class EditItemComponent implements OnChanges {

  @Input() item!: Discount;
  @Output() edit = new EventEmitter();

  details: LongStayDiscountDetail;

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  ngOnChanges({ item }: SimpleChanges) {
    if (item && item.currentValue !== item.previousValue) {
      this.load();
    }
  }

  @Loading(LoaderType.ITEM)
  async load() {
    this.details = await this.apiClient.getLongStayDiscountDetail(this.item.id).toPromise();
  }

  onSave = () => {
    this.edit.emit();
  }
}
