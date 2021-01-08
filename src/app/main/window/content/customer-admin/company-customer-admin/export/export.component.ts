import { Component, OnInit } from '@angular/core';

import delay from 'delay';
import { saveAs } from 'file-saver';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.pug',
  styleUrls: ['./export.component.sass']
})
export class ExportComponent implements OnInit {

  progress = 0;
  url = '';

  constructor(
    private apiClient: ApiClient,
    private mainService: MainService
  ) { }

  async ngOnInit() {
    const serialNumber = this.mainService.getCompanyDetails().c_serialNumber;

    await this.apiClient.startExport(serialNumber).toPromise();
    while (this.progress < 100) {
      this.progress = await this.getProgress();
      await delay(1000);
    }
    this.url = await this.apiClient.removeProgressFile().toPromise();
  }

  downloadFile() {
    if (!this.url) { throw new Error('Url is empty'); }
    // saveAs(environment.remoteUrl + this.url, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    saveAs(environment.remoteUrl + this.url.replace(/^\//, ''), 'Customers.xlsx');
  }

  async getProgress() {
    const response = await this.apiClient.checkExportProgress().toPromise();

    return response === 'WRITING_EXCEL_FILE' ? 100 : +response;
  }
}
