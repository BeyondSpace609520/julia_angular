import { Component, OnInit } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { PortalAdminCategory } from '../models';

enum DetailMode {
  EDIT = 'edit',
  CREATE = 'create'
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.pug',
  styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent implements OnInit {

  categories: PortalAdminCategory[] = [];
  selected?: PortalAdminCategory;

  mode?: DetailMode;

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.refresh();
  }

  @Loading(LoaderType.TAB)
  async refresh() {
    this.categories = await this.apiClient.getPortalAdminCategories().toPromise();
  }

  selectItem(item: PortalAdminCategory) {
    this.selected = this.getItemById(item.id);
    this.mode = DetailMode.EDIT;
  }

  @Loading(LoaderType.TAB)
  async addCategory() {
    this.mode = DetailMode.CREATE;
    this.selected = undefined;
  }

  @Loading(LoaderType.TAB)
  async deleteCategory(category?: PortalAdminCategory) {
    if (!category) {
      return;
    }
    await this.apiClient.deletePortalCategory(category.id).toPromise();
    this.refresh();
  }

  private getItemById(itemId: PortalAdminCategory['id']): PortalAdminCategory | undefined {
    return this.categories.find(c => c.id === itemId);
  }
}
