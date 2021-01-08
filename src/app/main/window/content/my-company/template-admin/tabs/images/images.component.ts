import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { FormDataService } from '@/app/main/shared/form-data.service';
import { CopyToSection, CopyToSectionItem } from '@/app/main/window/shared/copy-to/copy-to.component';
import { openCopyToModal } from '@/app/main/window/shared/copy-to/modal';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { SeasonPeriod } from '../../../../pricing-admin/season-periods/models';
import { LoaderType } from '../../loader-types';
import { EmailTemplateImages, EmailTemplateType } from '../../models';
import { TemplateAdminTabComponent } from '../tab.component';

@Component({
  selector: 'app-images-tab',
  templateUrl: './images.component.pug',
  styleUrls: ['./images.component.sass']
})
export class ImagesComponent extends TemplateAdminTabComponent {

  images?: EmailTemplateImages;

  get recordExist() {
    return Boolean(this.images);
  }

  constructor(
    loaderService: LoaderService,
    apiClient: ApiClient,
    private mainService: MainService,
    private modal: ModalService,
    private ebDate: EbDatePipe,
    private translate: TranslateService,
    private formDataService: FormDataService
  ) {
    super(loaderService, apiClient);
  }

  @Loading(LoaderType.Tab)
  async load() {
    this.images = await this.apiClient.getEmailTemplateImages(this.template.id, this.localeId, this.period && this.period.id).toPromise();
  }

  @Loading(LoaderType.Tab)
  async copyDefault() {
    await this.apiClient.copyDefaultEmailTemplateImages(this.template.id, this.localeId, this.period && this.period.id).toPromise();
    this.update.emit();
    this.load();
  }

  @Loading(LoaderType.Tab)
  async useDefault(period: SeasonPeriod) {
    await this.apiClient.useImageTemplateAsDefault(this.template.id, period.id, this.localeId).toPromise();
    this.update.emit();
    this.load();
  }

  @Loading(LoaderType.Tab)
  async upload(file: File, source: keyof EmailTemplateImages) {
    const db = this.mainService.getCompanyDetails().dbName;

    // tslint:disable-next-line: max-line-length
    await this.apiClient.uploadEmailTemplatePicture(this.template.id, file, source, db, this.localeId, this.period && this.period.id).toPromise();
    this.update.emit();
    this.load();
  }

  @Loading(LoaderType.Tab)
  async clear(source: keyof EmailTemplateImages) {
    await this.apiClient.clearEmailTemplateImage(this.template.id, source, this.localeId, this.period && this.period.id).toPromise();
    this.load();
  }

  @Loading(LoaderType.Tab)
  async openCopyTo(source: keyof EmailTemplateImages) {
    const locals = this.formDataService.getLocals();
    const periods = await this.apiClient.getSeasonPeriods().toPromise();
    const locale = locals.find(l => +l.value === this.localeId);
    // tslint:disable-next-line: max-line-length
    const periodRange = this.period ? ` ${this.ebDate.transform(this.period.fromDate, false)} - ${this.ebDate.transform(this.period.untilDate, false)}` : 'DEFAULT';
    const localeName = locale ? await this.translate.get(`BackEnd_WikiLanguage.${locale.name}`).toPromise() : null;
    const sourceLabel =  [this.template.name, localeName, periodRange, this.period && this.period.name]
      .filter(l => l).join(', ');
    const templates = await this.apiClient.getEmailTemplates(EmailTemplateType.ALL).toPromise();

    const modal = openCopyToModal(this.modal, () => this.load());
    const sections: CopyToSection[] = [
      {
        label: 'BackEnd_WikiLanguage.ET_EMailReason',
        items: templates.map(t => ({
          id: t.id,
          label: t.translation,
          checked: t.id === this.template.id,
          readonly: t.id === this.template.id
        } as CopyToSectionItem))
      },
      {
        label: 'BackEnd_WikiLanguage.ET_EMailLocale',
        items: locals.map(l => ({
          id: l.value,
          label: `BackEnd_WikiLanguage.${l.name}`,
          checked: +l.value === this.localeId,
          readonly: +l.value === this.localeId
        } as CopyToSectionItem))
      },
      {
        label: 'BackEnd_WikiLanguage.ET_EMailSeasonPeriod',
        items: [{ id: undefined, name: 'DEFAULT' }, ...periods].map(p => ({
          id: p.id,
          label: p.name,
          checked: p.id === (this.period && this.period.id),
          readonly: p.id === (this.period && this.period.id)
      } as CopyToSectionItem))
      }
    ];
    modal.init({ source: sourceLabel }, sections, async ([templateIds, localIds, periodIds]) => {
      const ids = { templateIds, localIds, periodIds: periodIds.map(p => p || 0) };
      const { template, localeId, period } = this;

      await this.apiClient.copyToEmailTemplateImages(template.id, source, ids, localeId, period && period.id).toPromise();
      this.load();
    });
  }
}
