import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-type';
import { ChargingScheme, ChargingSchemeLinkedCategory } from '../models';

@Component({
  selector: 'app-linked-categories',
  templateUrl: './linked-categories.component.pug',
  styleUrls: ['./linked-categories.component.sass']
})
export class LinkedCategoriesComponent implements OnChanges {

  @Input() scheme!: ChargingScheme;

  categories: ChargingSchemeLinkedCategory[] = [];

  constructor(
    public loaderService: LoaderService,
    private apiClient: ApiClient
  ) { }

  reset(all: boolean, checked: boolean) {
    if (all) {
      this.categories.forEach(c => c.checked = checked);
    } else {
      const [allCategory, ...categories] = this.categories;

      allCategory.checked = categories.every(c => c.checked);
    }
  }

  @Loading(LoaderType.MANAGE)
  async ngOnChanges({ scheme }: SimpleChanges) {
    if (!scheme || scheme.currentValue === scheme.previousValue) { return; }

    this.categories = await this.apiClient.getChargingSchemeLinkedCategories(this.scheme.id).toPromise();
  }

  @Loading(LoaderType.MANAGE)
  public async save() {
    await this.apiClient.setChargingSchemeLinkedCategories(this.scheme.id, this.categories).toPromise();
  }
}
