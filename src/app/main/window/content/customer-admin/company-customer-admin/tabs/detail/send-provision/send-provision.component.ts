import { ApiClient } from '@/app/helpers/api-client';
import { LoaderType } from '@/app/main/window/shared/customer/anonymize/loader-types';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-send-provision',
  templateUrl: './send-provision.component.pug',
  styleUrls: ['./send-provision.component.sass']
})
export class SendProvisionComponent implements OnDestroy {

  public bodyText = '';
  public email = new FormControl('', [Validators.required, Validators.email]);
  public isLoading: Observable<boolean>;

  constructor(
    private translate: TranslateService,
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MODAL);
    this.translate.get('BackEnd_WikiLanguage.dsgvoInformationMailConfirmation').toPromise().then(text => {
      this.bodyText = text;
    });
  }

  init(email: string, onChange: (valid) => void): void {
    this.email.valueChanges.pipe(untilDestroyed(this)).subscribe(() => onChange(this.email.valid));
    this.email.setValue(email);
  }

  @Loading(LoaderType.MODAL)
  public async save(params: {c_id: string}): Promise<void> {
    await this.apiClient.sendProvisionOfInformation(params, this.email.value).toPromise();
  }

  ngOnDestroy(): void {}
}
