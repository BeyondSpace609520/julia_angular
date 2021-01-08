import { Component } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';

@Component({
  selector: 'app-portal-admin',
  templateUrl: './portal-admin.component.pug',
  styleUrls: ['./portal-admin.component.sass']
})
export class PortalAdminComponent {

  public tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'portals',
        label: 'BackEnd_WikiLanguage.POA_Portals'
      },
      {
        id: 'categories',
        label: 'BackEnd_WikiLanguage.POA_PortalCategories'
      }
    ],
    buttonClasses: ['nav-link']
  };
  public activeTabId = 'portals';

  public isLoading: Observable<boolean>;

  constructor(
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.TAB);
  }
}
