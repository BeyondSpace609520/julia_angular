import { Component, EventEmitter,  Input, OnInit, Output } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';
import { Observable } from 'rxjs';

import { MainService } from '@/app/main/main.service';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-type';
import { RoomListItem } from '../models';
import { CompanyDetails } from '@/app/main/models';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.pug',
  styleUrls: ['./edit-room.component.sass']
})
export class EditRoomComponent implements OnInit {

  @Input() selectedItem!: RoomListItem;
  @Input() preselectTabId?: string;
  @Output() preselectTabIdChange = new EventEmitter<string | undefined>();
  @Output() edited = new EventEmitter<string>();

  tabSettings: TabsSettings = {
    buttons: [],
    buttonClasses: ['nav-link']
  };
  activeTabId = 'detail';
  isLoading: Observable<boolean>;
  company: CompanyDetails;
  hasAdvancedPricing: boolean;

  constructor(
    private loaderService: LoaderService,
    private mainService: MainService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.TAB);
    this.company = this.mainService.getCompanyDetails();
    this.hasAdvancedPricing = this.company.c_hasAdvancedPricingModule === 'on';
  }

  onTabEdited(): void {
    this.edited.emit(this.activeTabId);
  }

  ngOnInit(): void {
    this.tabSettings.buttons.push({ id: 'detail', label: 'BackEnd_WikiLanguage.EAT_EntityDetail' });

    if (!this.hasAdvancedPricing) { return; }

    this.tabSettings.buttons.push(
      { id: 'description', label: 'BackEnd_WikiLanguage.EAT_EntityLongDesc' },
      { id: 'images', label: 'BackEnd_WikiLanguage.EAT_EntityImages' },
      { id: 'layout', label: 'Layout' },
    );

    if (this.company.c_beRoomLevelPricingEnabled === 'on') {
      this.tabSettings.buttons.push(
        { id: 'pricing', label: 'BackEnd_WikiLanguage.EAT_EntityPricing' }
      );
    }

    if (this.preselectTabId) {
      this.activeTabId = this.preselectTabId;
      this.preselectTabId = undefined;
      this.preselectTabIdChange.emit(undefined);
    }
  }
}
