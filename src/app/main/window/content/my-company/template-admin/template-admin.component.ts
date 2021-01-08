import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
import { EmailTemplate, EmailTemplateType } from './models';
import { getTabSettings } from './tabs/settings';

@Component({
  selector: 'app-template-admin',
  templateUrl: './template-admin.component.pug',
  styleUrls: ['./template-admin.component.sass']
})
export class TemplateAdminComponent implements OnInit {

  locales: FormOption[] = [];
  type = new FormControl(EmailTemplateType.CUSTOMER);
  periodId = new FormControl(null);
  localeId = new FormControl(null);
  templates: EmailTemplate[] = [];
  selectedTemplateId: EmailTemplate['id'];
  tabSettings: TabsSettings = getTabSettings(() => this.selected, () => this.type.value);
  activeTabId = 'email';
  isLoading: Observable<boolean>;
  isTabLoading: Observable<boolean>;

  EmailTemplateType = EmailTemplateType;

  get selected() {
    return this.templates.find(t => t.id === this.selectedTemplateId);
  }

  constructor(
    private loaderService: LoaderService,
    private apiClient: ApiClient,
    private formDataService: FormDataService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.Load);
    this.isTabLoading = this.loaderService.isLoading(LoaderType.Tab);
    this.type.valueChanges.subscribe(() => {
      this.load();
    });
  }

  @Loading(LoaderType.Load)
  async ngOnInit() {
    this.locales = this.formDataService.getLocals();
    this.localeId.setValue(this.locales[0].value);
    this.load();
  }

  @Loading(LoaderType.Load)
  async load() {
    this.templates = await this.apiClient.getEmailTemplates(this.type.value).toPromise();
  }

  async selectItem(template: EmailTemplate) {
    this.selectedTemplateId = template.id;
  }
}
