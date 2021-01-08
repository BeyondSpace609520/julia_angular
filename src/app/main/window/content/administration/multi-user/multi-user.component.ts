import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from './loader-types';
import { MultiUserCreateStatus } from './models';

@Component({
  selector: 'app-multi-user',
  templateUrl: './multi-user.component.pug',
  styleUrls: ['./multi-user.component.sass']
})
export class MultiUserComponent implements OnInit {
  public form: FormGroup;

  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService,
  ) {
    this.isLoading = this.loaderService.isLoadingAnyOf([LoaderType.Creation, LoaderType.Action]);
  }

  @Loading(LoaderType.Creation)
  public async onCreateMultiuser(): Promise<void> {
    const username = this.form.getRawValue().username;
    const password = this.form.getRawValue().password;
    const databases = this.form.getRawValue().databases;

    const response = await this.apiClient.createMultiUser(username, password, databases).toPromise();
    this.showMessage(response.status, response.message);
  }

  private showMessage(status: MultiUserCreateStatus, message: string) {
    const classes: string[] = [];
    if (status === 'ERROR') {
      classes.push('error');
    }
    this.modalService.openSimpleText(message, undefined, {
      classes,
      disableClose: true,
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      databases: new FormControl('')
    });
  }

}
