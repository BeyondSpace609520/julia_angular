import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { openInsertModal } from '@/app/main/window/shared/insert-modal/insert-modal';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { CustomerItem, CustomerUser } from '../../models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.pug',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnChanges {
  @Input() customer: CustomerItem;
  public users: CustomerUser[] = [];
  public selectedUser: CustomerUser | null;

  constructor(
    private apiClient: ApiClient,
    private modalService: ModalService,
    public loaderService: LoaderService
  ) { }

  public newUser(): void {
    openInsertModal(this.modalService, '', 'BackEnd_WikiLanguage.RCAU_UserName', async (name: string) => {
      try {
        const selectedUserId = await this.apiClient.insertCustomerUser(this.customer.dbName, name).toPromise();
        this.selectedUser = this.users.find(user => user.id === selectedUserId) || null;
        this.load();
        return true;
      } catch (e) {
        this.modalService.openSimpleText('BackEnd_WikiLanguage.RCAU_AlertUserNameExists');
        return false;
      }
    });
  }

  @Loading(LoaderType.TAB)
  public async load(): Promise<void> {
    this.users = await this.apiClient.getCustomerUsers(this.customer.dbName).toPromise();
  }

  ngOnChanges({customer}: SimpleChanges): void {
    if (customer) {
      this.load();
    }
  }
}
