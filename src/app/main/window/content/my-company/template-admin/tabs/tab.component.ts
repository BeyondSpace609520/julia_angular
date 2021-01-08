import { EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { SeasonPeriod } from '../../../pricing-admin/season-periods/models';
import { LoaderType } from '../loader-types';
import { EmailTemplate, EmailTemplateDetail } from '../models';

export class TemplateAdminTabComponent implements OnChanges {

    @Input() template!: EmailTemplate;
    @Input() localeId!: number;
    @Input() period?: SeasonPeriod;
    @Output() update = new EventEmitter();

    detail: EmailTemplateDetail;

    constructor(
        protected loaderService: LoaderService,
        protected apiClient: ApiClient
    ) {}

    async ngOnChanges({ template, localeId, period }: SimpleChanges) {
        if ((template && template.currentValue !== template.previousValue)
            || (localeId && localeId.currentValue !== localeId.previousValue)
            || (period && period.currentValue !== period.previousValue)) {
            await this.load();
        }
    }

    @Loading(LoaderType.Tab)
    protected async load() {
        const { template, localeId, period } = this;
        this.detail = await this.apiClient.getEmailTemplateDetail(template.id, localeId, period && period.id).toPromise();
    }

    @Loading(LoaderType.Tab)
    protected async getDefaultTemplate(): Promise<EmailTemplateDetail> {
        const { template, localeId } = this;
        return await this.apiClient.getEmailTemplateDetail(template.id, localeId, 0).toPromise();
    }
}
