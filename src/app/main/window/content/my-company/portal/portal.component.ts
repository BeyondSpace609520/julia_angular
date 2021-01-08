import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
import { Portal, PortalCategory, PortalFeature } from './models';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.pug',
  styleUrls: ['./portal.component.sass']
})
export class PortalComponent {

  locale = new FormControl();
  locales: FormOption[] = [];
  features: PortalFeature[] = [];
  categories: PortalCategory[] = [];
  portal: Portal;
  isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    private formDataService: FormDataService,
    private authService: AuthService,
    private apiClient: ApiClient
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.locales = this.formDataService.getLocals();
    this.locale.valueChanges.subscribe(() => this.load());
    this.locale.setValue(this.authService.getQueryParams().languageId);
  }

  @Loading(LoaderType.LOAD)
  async load(): Promise<void> {
    [this.features, this.categories, this.portal] = await Promise.all([
      this.apiClient.getPortalFeatures(this.locale.value).toPromise(),
      this.apiClient.getPortalCategories(this.locale.value).toPromise(),
      this.apiClient.getPortal(this.locale.value).toPromise()
    ]);
  }

  @Loading(LoaderType.LOAD)
  async save(): Promise<void> {
    await this.apiClient.savePortal(this.portal, this.features, this.categories).toPromise();
    this.load();
  }
}
