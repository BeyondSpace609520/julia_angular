import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { openInsertModal } from '../../../shared/insert-modal/insert-modal';
import { LoaderType } from './loader-types';
import { SpecialOffer } from './models';

@Component({
  selector: 'app-special-offers',
  templateUrl: './special-offers.component.pug',
  styleUrls: ['./special-offers.component.sass']
})
export class SpecialOffersComponent {

  showOffline = new FormControl();
  items: SpecialOffer[] = [];
  selectedItemId: SpecialOffer['id'] | null;
  isLoading: Observable<boolean>;

  // TODO replace getter function with pipe or static variable
  get enabled() {
    return this.mainService.getCompanyDetails().c_specialOfferEnabled === 'on';
  }

  // TODO replace getter function with pipe or static variable
  get selected() {
    return this.items.find(item => item.id === this.selectedItemId);
  }

  constructor(
    private apiClient: ApiClient,
    private mainService: MainService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private eventBusService: EventBusService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.showOffline.valueChanges.subscribe(() => this.load());
    this.showOffline.setValue(false);
  }

  @Loading(LoaderType.LOAD)
  async load(selectOfferId?: number, checkOffline?: boolean): Promise<void> {
    if (checkOffline === true || checkOffline === false) { // not undefined
      this.showOffline.setValue(checkOffline, {emitEvent: false});
    }
    this.items = await this.apiClient.getSpecialOffers(this.showOffline.value).toPromise();
    if (selectOfferId) {
      this.selectItem(selectOfferId);
    }
  }

  selectItem(item?: SpecialOffer['id']): void {
    this.selectedItemId = item || null;
  }

  newOffer(): void {
    openInsertModal(this.modalService, 'BackEnd_WikiLanguage.SO_NewSOHeader', 'BackEnd_WikiLanguage.SO_Title', async (name: string) => {
      const { languageId } = this.authService.getQueryParams();

      const offerId = await this.apiClient.insertSpecialOffer(name, languageId).toPromise();

      this.selectItem(offerId);
      this.load();

      return true;
    });
  }

  @Loading(LoaderType.LOAD)
  async copy(offer: SpecialOffer): Promise<void> {
    const offerId = await this.apiClient.copySpecialOffer(offer).toPromise();

    this.load(offerId, true);
  }

  @Loading(LoaderType.LOAD)
  async delete(offer: SpecialOffer): Promise<void> {
    this.modalService.openConfirm('BackEnd_WikiLanguage.SO_ConfirmDeleteMessage').then(async (confirmed) => {
      if (confirmed) {
        await this.apiClient.deleteSpecialOffer(offer).toPromise();
        this.selectItem();
        this.load();
      }
    });
  }

  onTabSaved(): void {
    sendRoomplanUpdate(this.eventBusService, 'specialOfferAdminChanged');
    this.load();
  }
}
