import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { TableField } from '@/app/main/window/shared/table/models';

import { exportAsExcel } from '@/app/main/shared/exporters/exportExcel';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(
    private translate: TranslateService
  ) { }

  public async asExcel<T>(tableFields: TableField[], items: T[], name: string): Promise<void> {
    const translations = await this.getFieldTranslations(tableFields);
    const fields = this.getFields(tableFields, translations);
    exportAsExcel<T>(fields, items, name);
  }

  private async getFieldTranslations(tableFields: TableField[]): Promise<{[k: string]: string}> {
    return this.translate.get(
      tableFields.map(field => field.label)
    ).toPromise();
  }

  private getFields(tableFields: TableField[], translations: {[k: string]: string}): ExportFields {
    const fields: ExportFields = {};
    tableFields.forEach(field => {
      fields[field.id] = translations[field.label];
    });
    return fields;
  }
}

export interface ExportFields {
  [key: string]: string;
}
