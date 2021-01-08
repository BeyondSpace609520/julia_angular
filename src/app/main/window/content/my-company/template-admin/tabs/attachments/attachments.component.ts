import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiTemplateAdminService } from '@/app/helpers/api/api-template-admin.service';
import { SeasonPeriod } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { EmailTemplate, TemplateAttachment } from '../../models';

@Component({
  selector: 'app-attachments-tab',
  templateUrl: './attachments.component.pug',
  styleUrls: ['./attachments.component.sass']
})
export class AttachmentsComponent implements OnChanges {
  @Input() template!: EmailTemplate;
  @Input() localeId!: number;
  @Input() period: SeasonPeriod;

  public attachments: TemplateAttachment[];
  public isLoading: Observable<boolean>;

  constructor(
    private apiTemplateAdminService: ApiTemplateAdminService,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.Tab);
  }

  @Loading(LoaderType.Tab)
  private async load(): Promise<void> {
    this.attachments = await this.apiTemplateAdminService.getAttachments(
      this.template.id,
      this.localeId,
      this.period ? this.period.id : 0
    ).toPromise();
  }

  ngOnChanges({template, localeId, period}: SimpleChanges): void {
    if (template || localeId || period) {
      this.load();
    }
  }

}
