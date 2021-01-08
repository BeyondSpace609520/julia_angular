import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Window, WindowContent } from '../../../models';
import { WindowsService } from '../../../windows.service';
import { HotelRegistrationRecord } from '../guest-registration/models';
import { EditComponent } from './edit/edit.component';
import { LoaderType } from './loader-types';
import { GuestDetail } from './models';
import { ValidationLevel } from './utils';

@Component({
  selector: 'app-guest-information',
  templateUrl: './guest-information.component.pug',
  styleUrls: ['./guest-information.component.sass']
})
export class GuestInformationComponent implements WindowContent, OnInit {

  @Input() bookingId: number;
  @Input() hotel?: HotelRegistrationRecord;
  @Input() baseValidation: ValidationLevel;
  @Input() mainGuestId: GuestDetail['id'];
  @Input() preselectGuestId?: GuestDetail['id'];
  @Input() window: Window;
  @Input() onGuestSaved: (guest: GuestDetail) => void | undefined;

  @ViewChild('editForm', { static: false }) editForm!: EditComponent;

  public items: GuestDetail[] = [];
  public selectedItemId: number | null = null;
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private windowsService: WindowsService,
    private modal: ModalService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_LIST);
  }

  public async guestSaved(): Promise<void> {
    await this.load();
    const selectedItem = this.items.find(item => item.id === this.selectedItemId);
    if (this.onGuestSaved && selectedItem) {
      this.onGuestSaved(selectedItem);
    }
  }

  @Loading(LoaderType.LOAD_LIST)
  public async load(): Promise<void> {
    this.items = await this.apiClient.getBookingGuests(this.bookingId).toPromise();
  }

  public async selectItem(item: GuestDetail): Promise<void> {
    if (this.editForm && this.editForm.isDirty()) {
      const confirmed = await this.modal.openConfirm('Attention!', 'BackEnd_WikiLanguage.MW_updatedGuest', {
        primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Yes',
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel'
      });

      if (!confirmed) { return; }
    }

    this.selectedItemId = item.id;
  }

  public closeWindow(): void {
    this.windowsService.closeWindow(this.window);
  }

  async ngOnInit(): Promise<void> {
    await this.load();
    this.selectItem(this.items.find(item => item.id === this.preselectGuestId) || this.items[0]);
  }
}
