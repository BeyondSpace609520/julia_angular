import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ModalService } from '@/ui-kit/services/modal.service';
import { LoaderType } from '../../../loader-types';
import { CustomerUser } from '../../../models';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.pug',
  styleUrls: ['./edit-user.component.sass']
})
export class EditUserComponent implements OnChanges {

  @Input() user!: CustomerUser;
  @Output() update = new EventEmitter();

  public showTick: boolean;
  public form: FormGroup;

  private get dbName() {
    return this.cacheService.getCompanyDetailsSnapshot().dbName;
  }

  constructor(
    public loaderService: LoaderService,
    private apiClient: ApiClient,
    private cacheService: CacheService,
    private modalService: ModalService,
  ) { }

  @Loading(LoaderType.TAB)
  public async save() {
    const user: CustomerUser = {
      ...this.user,
      ...this.form.getRawValue()
    };

    try {
      const selectedUserId = await this.apiClient
        .updateCustomerUser(this.dbName, user)
        .toPromise();
      // save username for later password change
      this.user.username = user.username;
      this.update.emit();
    } catch (e) {
      this.modalService.openSimpleText(
        "BackEnd_WikiLanguage.RCAU_AlertUserNameExists"
      );
    }
  }

  public async delete() {
    if (await this.modalService.openConfirm(
      'BackEnd_WikiLanguage.deleteUserConfirmationTitle',
      'BackEnd_WikiLanguage.deleteUserConfirmation',
    )) {
      this.deleteUser();
    }
  }

  @Loading(LoaderType.TAB)
  public async resetPassword() {
    this.showTick = await this.apiClient.resetCustomerUserPassword(this.dbName, this.user.username).toPromise();
  }

  @Loading(LoaderType.TAB)
  private async deleteUser(): Promise<void> {
    await this.apiClient.deleteCustomerUser(this.dbName, this.user.id).toPromise();
    this.update.emit();
  }

  ngOnChanges({ user }: SimpleChanges) {
    if (user && user.currentValue !== user.previousValue) {
      this.form = new FormGroup({
        username: new FormControl(this.user.username),
        active: new FormControl(this.user.active),
      });
      this.showTick = false;
    }
  }
}
