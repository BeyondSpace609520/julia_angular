import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RawTemplateAttachment, TemplateAttachment } from '@/app/main/window/content/my-company/template-admin/models';
import { reduceTemplateAttachment } from '@/app/main/window/content/my-company/template-admin/reduce';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTemplateAdminService {

  constructor(private apiService: ApiService) { }

  public getAttachments(emailReasonId: number, localeId: number, seasonPeriodId: number): Observable<TemplateAttachment[]> {
    return this.apiService.mainApiPost<RawTemplateAttachment[]>(
      [emailReasonId, localeId, seasonPeriodId, 'appUser'],
      'EMailTemplateAdmin',
      'getAttachment'
    ).pipe(map(attachments => attachments.map(reduceTemplateAttachment)));
  }
}
