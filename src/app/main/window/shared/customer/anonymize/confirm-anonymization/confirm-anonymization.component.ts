import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { CustomerConfirmParams } from '../models';

@Component({
  selector: 'app-confirm-anonymization',
  templateUrl: './confirm-anonymization.component.pug',
  styleUrls: ['./confirm-anonymization.component.sass']
})
export class ConfirmAnonymizationComponent implements OnDestroy {

  bodyText = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  isLoading: Observable<boolean>;

  constructor(
    private translate: TranslateService,
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MODAL);
    this.translate.get('BackEnd_WikiLanguage.anonymizationConfirmationMailText').toPromise().then(text => {
      this.bodyText = text;
    });
  }

  init(email: string, onChange: (valid) => void): void {
    this.email.valueChanges.pipe(untilDestroyed(this)).subscribe(() => onChange(this.email.valid));
    this.email.setValue(email);
  }

  @Loading(LoaderType.MODAL)
  public async save(params: CustomerConfirmParams): Promise<void> {
    await this.apiClient.sendAnonymizeConfirmationComments(params, this.email.value).toPromise();
  }

  ngOnDestroy(): void {}
}
