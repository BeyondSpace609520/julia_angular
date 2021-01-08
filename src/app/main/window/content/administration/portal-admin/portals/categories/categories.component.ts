import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { FormOption } from '@/app/main/shared/form-data.service';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { LoaderType } from '../../loader-types';
import { PortalAdmin, PortalAdminCategoryPackage } from '../../models';

@Component({
  selector: 'app-portal-categories',
  templateUrl: './categories.component.pug',
  styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent implements OnInit, OnChanges {

  @Input() portal!: PortalAdmin;

  categories: {[categoryId: string]: PortalAdminCategoryPackage};
  imageSrc: string | null = null;
  labels: FormOption<number>[];
  selected?: PortalAdminCategoryPackageWithLabel;

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService,
    private mainService: MainService
  ) { }

  @Loading(LoaderType.INNER_TAB)
  async ngOnInit() {
    this.labels = await this.apiClient.getSpecialOfferCategoriesObjects().toPromise();
  }

  ngOnChanges({ portal }: SimpleChanges) {
    if (portal && portal.currentValue !== portal.previousValue) {
      this.load();
    }
  }

  @Loading(LoaderType.INNER_TAB)
  async load() {
    const categories = await this.apiClient.getPortalSpecialOfferCategories(this.portal.id).toPromise();

    this.categories = categories.reduce((acc, item) => ({ ...acc, [item.specialOfferCategoryId]: item }), {});
    this.selected = undefined;
  }

  @Loading(LoaderType.INNER_TAB)
  async save() {
    await this.apiClient.savePortalSpecialOfferCategory(Object.values(this.categories)).toPromise();
  }

  @Loading(LoaderType.INNER_TAB)
  async uploadImage(category: PortalAdminCategoryPackage) {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');
    const { dbName } = this.mainService.getCompanyDetails();

    if (file) {
      await this.apiClient.uploadPortalAdminCategoryImage(category.specialOfferCategoryId, this.portal.id, file, dbName).toPromise();
      this.load();
    }
  }

  @Loading(LoaderType.INNER_TAB)
  async clearImage(category: PortalAdminCategoryPackage) {
    await this.apiClient.deletePortalAdminCategoryImage(category.specialOfferCategoryId, this.portal.id).toPromise();
    this.load();
  }

  selectItem(item?: PortalAdminCategoryPackageWithLabel): void {
    this.selected = item;
    if (item) {
      this.imageSrc = `${environment.mediaUrl}${item.category.image || '/wo/Services/images/0000000000_NoImage.jpg'}`;
    } else {
      this.imageSrc = null;
    }
  }
}

interface PortalAdminCategoryPackageWithLabel {
  label: string;
  category: PortalAdminCategoryPackage;
}
