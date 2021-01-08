import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { CompanyDetails } from '@/app/main/models';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { openInsertModal } from '../../../shared/insert-modal/insert-modal';
import { LoaderType } from './loader-type';
import { RoomCategory } from './models';

@Component({
  selector: 'app-room-category',
  templateUrl: './room-category.component.pug',
  styleUrls: ['./room-category.component.sass']
})
export class RoomCategoryComponent implements OnInit, OnDestroy {

  @Input() preselectRoomId?: number;
  @Input() preselectRoomCategoryId?: number;
  @Input() preselectTabId?: string;

  isListLoading: Observable<boolean>;
  isSaveLoading: Observable<boolean>;
  isTabLoading: Observable<boolean>;

  categories: RoomCategory[] = [];
  selectedItemId: number | null = null;
  companyDetails: CompanyDetails | null;

  get selectedItem(): RoomCategory {
    return this.categories.find(c => c.id === this.selectedItemId) as RoomCategory;
  }

  tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'details',
        label: 'BackEnd_WikiLanguage.EG_Detail'
      },
      {
        id: 'prices',
        label: 'BackEnd_WikiLanguage.EG_Pricing'
      },
      {
        id: 'pictures',
        label: 'BackEnd_WikiLanguage.EG_Pictures'
      },
      {
        id: 'features',
        label: 'BackEnd_WikiLanguage.EG_Features'
      },
      {
        id: 'layout',
        label: 'BackEnd_WikiLanguage.Thumbsketch'
      },
    ]
  };
  activeTabId: string = this.tabSettings.buttons[0].id;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private modalService: ModalService,
    private eventBusService: EventBusService,
    private mainService: MainService,
  ) {
    this.isListLoading = this.loaderService.isLoading(LoaderType.LOAD_LIST);
    this.isSaveLoading = this.loaderService.isLoading(LoaderType.SAVE_CATEGORY);
    this.isTabLoading = this.loaderService.isLoading(LoaderType.LOAD_TAB);
    this.mainService.company$.pipe(untilDestroyed(this)).subscribe(companyDetails => {
      this.companyDetails = companyDetails;
    });
    this.eventBusService.on('reloadCompanyDetails').pipe(untilDestroyed(this)).subscribe(() => {
      this.reloadCompanyAndCategoryData();
    });
  }

  @Loading(LoaderType.LOAD_LIST)
  async loadCategories() {
    const preselectRoomId = this.preselectRoomId;
    const preselectRoomCategoryId = this.preselectRoomCategoryId;
    const preselectTabId = this.preselectTabId;
    this.preselectRoomId = undefined;
    this.preselectRoomCategoryId = undefined;
    this.preselectTabId = undefined;
    this.categories = await this.apiClient.getRoomCategories(preselectRoomId).toPromise();
    const preselectedCategory = this.getPreselectedCategory(preselectRoomCategoryId);
    if (preselectedCategory) {
      this.selectCategory(preselectedCategory);
    }
    if (preselectTabId) {
      this.activeTabId = preselectTabId;
    }
  }

  private getPreselectedCategory(preselectRoomCategoryId?: number): RoomCategory | null {
    const preselectedCategory = this.categories.find(category => category.preselectThis);
    if (preselectedCategory) {
      return preselectedCategory;
    }
    if (preselectRoomCategoryId) {
      return this.categories.find(category => category.id === preselectRoomCategoryId) || null;
    }
    return null;
  }

  onTabSaved(): void {
    if (['details', 'features'].includes(this.activeTabId)) {
      this.loadCategories();
    }
    sendRoomplanUpdate(this.eventBusService, 'categoryAdminChanged');
    if (this.activeTabId === 'features') {
      sendRoomplanUpdate(this.eventBusService, 'equipmentChanged');
    }
  }

  selectCategory(item: RoomCategory) {
    this.selectedItemId = item.id;
  }

  async newCategory() {
    openInsertModal(this.modalService, 'BackEnd_WikiLanguage.EGN_Title', 'BackEnd_WikiLanguage.EG_SystemValue', async (name) => {
      await this.apiClient.insertCategory(name).toPromise();
      await this.loadCategories();

      return true;
    });
  }

  @Loading(LoaderType.LOAD_LIST)
  async deleteCategory(category: RoomCategory) {
    const linkedRooms = await this.apiClient.getLinkedRooms(category.id).toPromise();

    if (linkedRooms.length > 0) {
      const title = await this.translate.get('BackEnd_WikiLanguage.EG_AlertLinkedEntities').toPromise();

      this.modalService.openSimpleText(`${title} ${linkedRooms.map(r => r.uniqueNo).join(', ')}`, undefined, {
        hidePrimaryButton: true,
        closeLabel: 'general.buttonOk.text'
      });
    } else {
      const confirmed = await this.modalService.openConfirm('BackEnd_WikiLanguage.EG_AlertConfirmDeleteMSG', '');

      if (confirmed) {
        await this.apiClient.deleteCategory(category.id).toPromise();
        await this.loadCategories();
      }
    }
  }

  @Loading(LoaderType.LOAD_TAB)
  private async reloadCompanyAndCategoryData(): Promise<void> {
    await this.mainService.updateCompanyDetails(true);
  }

  async ngOnInit() {
    await this.loadCategories();
  }

  ngOnDestroy(): void {}
}
