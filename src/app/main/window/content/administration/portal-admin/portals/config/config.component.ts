import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { PortalAdmin } from '../../models';

@Component({
  selector: 'app-portal-config',
  templateUrl: './config.component.pug',
  styleUrls: ['./config.component.sass']
})
export class ConfigComponent implements OnChanges {

  @Input() portal!: PortalAdmin;

  form: FormGroup;

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  ngOnChanges({ portal }: SimpleChanges) {
    if (portal && portal.currentValue !== portal.previousValue) {
      this.load();
    }
  }

  @Loading(LoaderType.INNER_TAB)
  async load() {
    const details = await this.apiClient.getAdminPortal(this.portal.id).toPromise();

    this.form = new FormGroup({
      name: new FormControl(details.name),
      accountNo: new FormControl(details.accountNo),
      serialNo: new FormControl(details.serialNo),
      ip: new FormControl(details.ip),
      cssFile: new FormControl(details.cssFile),
      ciName: new FormControl(details.ciName),
      multiple: new FormControl(details.multiple),
      active: new FormControl(details.active),
      showInWizard: new FormControl(details.showInWizard),
    });
  }

  @Loading(LoaderType.INNER_TAB)
  async generateSerialNo() {
    const serialNo = await this.apiClient.checkAdminPortalSerialNo().toPromise();

    (this.form.get('serialNo') as FormControl).setValue(serialNo);
  }

  @Loading(LoaderType.INNER_TAB)
  async save() {
    const { name, accountNo, serialNo, ip, cssFile, ciName, multiple, active, showInWizard } = this.form.getRawValue();
    const portal: PortalAdmin = { id: this.portal.id, name, accountNo, serialNo, ip, cssFile, ciName, multiple, active, showInWizard };

    await this.apiClient.saveAdminPortal(portal).toPromise();
  }
}
