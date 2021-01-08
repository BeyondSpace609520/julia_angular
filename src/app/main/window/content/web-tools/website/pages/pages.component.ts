import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { WebsitePage, WebsitePageSource } from '../models';

enum LoaderType {
  LOAD = 'load-website-pages'
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.pug',
  styleUrls: ['./pages.component.sass']
})
export class PagesComponent implements OnChanges {

  @Input() localeId: number;

  tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'welcomePage',
        label: 'BackEnd_WikiLanguage.CMS_WelcomePage'
      },
      {
        id: 'imprintPage',
        label: 'BackEnd_WikiLanguage.CMS_ImprintPage'
      }
    ],
    buttonClasses: ['nav-link']
  };
  activeTabId: WebsitePageSource = 'welcomePage';
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{color: [] }],
      [{align: [] }],
      [{list: 'ordered'}, {list: 'bullet'}]
    ]
  };
  form: FormGroup;
  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
  }

  @Loading(LoaderType.LOAD)
  async loadForm(): Promise<void> {
    const data = await this.apiClient.getCmsText(this.localeId).toPromise();

    this.form = new FormGroup({
      welcomePage: new FormGroup({
        heading: new FormControl(data.welcomePage.heading),
        text: new FormControl(data.welcomePage.text),
      }),
      imprintPage: new FormGroup({
        heading: new FormControl(data.imprintPage.heading),
        text: new FormControl(data.imprintPage.text),
      })
    });
  }

  @Loading(LoaderType.LOAD)
  async save(): Promise<void> {
    const data: WebsitePage = (this.form.get(this.activeTabId) as FormGroup).getRawValue();

    await this.apiClient.saveCmsText(this.activeTabId, data, this.localeId).toPromise();
  }

  ngOnChanges({ localeId }: SimpleChanges): void {
    if (localeId && localeId.currentValue !== localeId.previousValue) {
      this.loadForm();
    }
  }
}
