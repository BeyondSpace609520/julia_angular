import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { PortalAdminBody } from '../../models';

@Component({
  selector: 'app-add-portal',
  templateUrl: './add-portal.component.pug',
  styleUrls: ['./add-portal.component.sass']
})
export class AddPortalComponent implements OnInit {

  public form: FormGroup;

  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MODAL);
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      accountNo: new FormControl(''),
      serialNo: new FormControl('', Validators.required),
      ip: new FormControl(''),
      cssFile: new FormControl(''),
      ciName: new FormControl(''),
      multiple: new FormControl(false),
      active: new FormControl(false),
      showInWizard: new FormControl(false),
    });
  }

  @Loading(LoaderType.MODAL)
  public async generateSerialNo(): Promise<void> {
    const serialNo = await this.apiClient.checkAdminPortalSerialNo().toPromise();

    (this.form.get('serialNo') as FormControl).setValue(serialNo);
  }

  @Loading(LoaderType.MODAL)
  public async insert(): Promise<number> {
    const data: PortalAdminBody = this.form.getRawValue();

    return await this.apiClient.createAdminPortal(data).toPromise();
  }

  ngOnInit(): void {
    this.form.updateValueAndValidity();
  }
}
