import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { Observable } from 'rxjs';

import { RawAutoAnonymizationSettings } from '@/app/main/window/content/customer-admin/general-settings/tabs/gdpr/models';

import { exportHTMLTableAsExcel } from '@/app/main/shared/exporters/exportExcel';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.pug',
  styleUrls: ['./gdpr.component.sass']
})
export class GdprComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public isLoading: Observable<boolean>;
  public autoAnonymize: boolean;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.GDPR);
  }

  private valueChanges() {
    (this.form.get('autoAnonymize') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(value =>
      this.autoAnonymize = value
    );
  }

  @Loading(LoaderType.GDPR)
  public async saveForm() {
    const postData: RawAutoAnonymizationSettings = {
      c_anonymizeIcal: (this.form.get('anonymizeIcal') as FormControl).value ? 'on' : 'off',
      c_autoAnonymizationDays: ((this.form.get('autoAnonymizationDays') as FormControl).value).toString(),
      c_autoAnonymize: (this.form.get('autoAnonymize') as FormControl).value ? '1' : '0',
      c_autoAnonymizeEmailToGuest: (this.form.get('autoAnonymizeEmailToGuest') as FormControl).value ? '1' : '0',
      c_hideAnonymizedGuests: (this.form.get('hideAnonymizedGuests') as FormControl).value ? '1' : '0',
    };
    await this.apiClient.saveAutoAnonymizationSettings(postData).toPromise();
  }

  @Loading(LoaderType.GDPR)
  public async downloadGuestList() {
    const fileContent = await this.apiClient.getExcelExportAnonymizationReport().toPromise();
    exportHTMLTableAsExcel(fileContent, 'anonymizationReport');
  }

  @Loading(LoaderType.GDPR)
  async ngOnInit(): Promise<void> {
    const autoAnonymizationSettings = await this.apiClient.getAutoAnonymizationSettings().toPromise();
    this.autoAnonymize = autoAnonymizationSettings.autoAnonymize;

    this.form = new FormGroup({
      hideAnonymizedGuests: new FormControl(autoAnonymizationSettings.hideAnonymizedGuests),
      autoAnonymize: new FormControl(autoAnonymizationSettings.autoAnonymize),
      autoAnonymizationDays: new FormControl(autoAnonymizationSettings.autoAnonymizationDays),
      autoAnonymizeEmailToGuest: new FormControl(autoAnonymizationSettings.autoAnonymizeEmailToGuest),
      anonymizeIcal: new FormControl(autoAnonymizationSettings.anonymizeIcal),
    });

    this.valueChanges();
  }

  ngOnDestroy(): void {}
}
