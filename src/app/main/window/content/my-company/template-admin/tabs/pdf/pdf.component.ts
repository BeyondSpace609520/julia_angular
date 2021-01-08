import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { SeasonPeriod } from '../../../../pricing-admin/season-periods/models';
import { LoaderType } from '../../loader-types';
import { EmailTemplateDetail } from '../../models';
import { TemplateAdminTabComponent } from '../tab.component';
import { templateNamesWithSummryInfo } from './consts';

@Component({
  selector: 'app-pdf-tab',
  templateUrl: './pdf.component.pug',
  styleUrls: ['./pdf.component.sass']
})
export class PdfComponent extends TemplateAdminTabComponent {

  form: FormGroup;

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{color: [] }],
      [{align: [] }],
      [{list: 'ordered'}, {list: 'bullet'}]
    ]
  };

  get hasSummaryInfo() {
    return templateNamesWithSummryInfo.includes(this.template.name);
  }

  constructor(
    loaderService: LoaderService,
    apiClient: ApiClient
  ) {
    super(loaderService, apiClient);
  }

  async load() {
    await super.load();
    this.form = new FormGroup({
      headerText: new FormControl(this.detail.headerText, [Validators.required]),
      withoutCommitmentLabel: new FormControl(this.detail.withoutCommitmentLabel),
      footerText: new FormControl(this.detail.footerText, [Validators.required]),
    });
  }


  @Loading(LoaderType.Tab)
  async save() {
    const { headerText, withoutCommitmentLabel, footerText } = this.form.getRawValue();
    const { emailImage = '', subject = '', emailText = '' } = this.detail || {};
    const detail: EmailTemplateDetail = {
      id: this.template.id,
      seasonPeriodId: this.period ? this.period.id : 0,
      localeId: this.localeId,
      subject,
      emailText,
      emailImage,
      footerText,
      headerText,
      withoutCommitmentLabel
    };

    await this.apiClient.saveEmailTemplateDetail(detail, true).toPromise();
    this.update.emit();
    this.load();
  }

  @Loading(LoaderType.Tab)
  async useDefault(period: SeasonPeriod) {
    await this.apiClient.useEmailTemplateAsDefault(this.template.id, period.id, this.localeId).toPromise();
    this.update.emit();
    this.load();
  }
}
