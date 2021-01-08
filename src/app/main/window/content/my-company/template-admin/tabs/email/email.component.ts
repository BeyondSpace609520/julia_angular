import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { stringify } from 'querystring';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { SeasonPeriod } from '../../../../pricing-admin/season-periods/models';
import { LoaderType } from '../../loader-types';
import { EmailTemplateDetail } from '../../models';
import { TemplateAdminTabComponent } from '../tab.component';
import { templateVariables } from './consts';

@Component({
  selector: 'app-email-tab',
  templateUrl: './email.component.pug',
  styleUrls: ['./email.component.sass']
})
export class EmailComponent extends TemplateAdminTabComponent implements OnDestroy {

  public form: FormGroup;
  public templateVariables = templateVariables;
  public emailTextPlaceholder = '';
  public emailSubjectPlaceholder = '';
  public isPeriodSelectedAndDefaultTemplateUsed = false;

  constructor(
    loaderService: LoaderService,
    apiClient: ApiClient,
    private mainService: MainService
  ) {
    super(loaderService, apiClient);
  }

  async load() {
    await super.load();
    this.setIsPeriodSelectedAndDefaultTemplateUsed(this.detail.subject, this.detail.emailText);
    this.form = new FormGroup({
      subject: new FormControl(this.detail ? this.detail.subject : '', [Validators.required]),
      emailText: new FormControl(this.detail ? this.detail.emailText : '', [Validators.required]),
    });
    this.setFormValueChanges();
  }

  @Loading(LoaderType.Tab)
  async save() {
    const { subject, emailText } = this.form.getRawValue();
    const { emailImage = '', footerText = '', headerText = '', withoutCommitmentLabel = '' } = this.detail || {};
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

    if (detail.emailText === '' || detail.subject === '') {
      const defaultTemplate = await super.getDefaultTemplate();
      if (detail.emailText === '' && defaultTemplate) {
        detail.emailText = defaultTemplate.emailText;
      }
      if (detail.subject === '' && defaultTemplate) {
        detail.subject = defaultTemplate.subject;
      }
    }

    await this.apiClient.saveEmailTemplateDetail(detail).toPromise();
    this.update.emit();
    this.load();
  }

  view() {
    const { dbName } = this.mainService.getCompanyDetails();
    const query = {
      er_id: this.template.id,
      etl_locale_id: this.localeId,
      etl_seasonPeriod_id: this.period ? this.period.id : 0,
      dbName
    };
    const path = `/wo/Services/com/eBook/emailContentPreview/EmailContentPreview.php?${stringify(query)}`;

    window.open(environment.remoteUrl + path, '_blank');
  }

  @Loading(LoaderType.Tab)
  async useDefault(period) {
    await this.apiClient.useEmailTemplateAsDefault(
      this.template.id,
      period.id,
      this.localeId
    ).toPromise();
    this.update.emit();
    this.load();
  }

  private setIsPeriodSelectedAndDefaultTemplateUsed(subject: string, emailText: string) {
    // console.log(subject, emailText);
    this.isPeriodSelectedAndDefaultTemplateUsed = false;
    if (this.period) {
      this.emailTextPlaceholder = 'BackEnd_WikiLanguage.TA_EmailTextPlaceholder';
      this.emailSubjectPlaceholder = 'BackEnd_WikiLanguage.TA_EmailSubjectPlaceholder';
      if (subject === '' &&  emailText === '') {
        this.isPeriodSelectedAndDefaultTemplateUsed = true;
      }
    }
  }

  private setFormValueChanges() {
    (this.form.get('subject') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.setIsPeriodSelectedAndDefaultTemplateUsed(value, (this.form.get('emailText') as FormControl).value);
    });
    (this.form.get('emailText') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.setIsPeriodSelectedAndDefaultTemplateUsed((this.form.get('subject') as FormControl).value, value);
    });
  }

  ngOnDestroy(): void {}
}
