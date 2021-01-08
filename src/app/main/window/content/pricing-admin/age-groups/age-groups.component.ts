import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
import { ManageGroupComponent } from './manage-group/manage-group.component';
import { AgeGroup } from './models';

@Component({
  selector: 'app-age-groups',
  templateUrl: './age-groups.component.pug',
  styleUrls: ['./age-groups.component.sass']
})
export class AgeGroupsComponent implements OnInit, OnChanges, OnDestroy {

  groups: AgeGroup[] = [];

  selected: AgeGroup | null;
  form: FormGroup;

  get isWrongStartGroup(): boolean {
    return this.groups[0] && this.groups[0].from !== 0;
  }

  get isWrongEndGroup(): boolean {
    return this.groups[this.groups.length - 1] && this.groups[this.groups.length - 1].to !== 17;
  }

  get wrongSequenceGroup(): AgeGroup | null {
    for (let i = 1; i < this.groups.length; i++) {
      if (this.groups[i - 1].to !== this.groups[i].from - 1) {
        return this.groups[i];
      }
    }
    return null;
  }

  get canSaveForAll() {
    return this.mainService.getCompanyDetails().au_isAdmin === 'on';
  }

  @ViewChild('manageGroup', { static: false }) manageGroup!: ManageGroupComponent;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private mainService: MainService,
    private modal: ModalService,
    private eventBusService: EventBusService,
  ) { }

  public isGroupsLoading(): boolean {
    return this.loaderService.isActive(LoaderType.LOAD_AGE_GROUPS);
  }

  @Loading(LoaderType.LOAD_AGE_GROUPS)
  public async loadGroups(selectId?: number): Promise<void> {
    this.groups = await this.apiClient.getAgeGroups().toPromise();
    if (selectId) {
      const selectItem = this.groups.find(group => group.id === selectId);
      if (selectItem) {
        this.selectItem(selectItem);
      }
    }
  }

  public selectItem(group: AgeGroup): void {
    this.selected = group;
  }

  public async save(): Promise<void> {
    if (!this.selected) {
      return;
    }
    await this.manageGroup.save(this.selected.id);
    this.loadGroups();
  }

  @Loading(LoaderType.MANAGE_AGE_GROUP)
  public async deleteGroup(group: AgeGroup | null): Promise<void> {
    if (!group) {
      return;
    }

    const confirmed = await this.modal.openConfirm(
      'BackEnd_WikiLanguage.AG_ConfirmDeleteMessageHeader',
      'BackEnd_WikiLanguage.AG_ConfirmDeleteMessage'
    );

    if (confirmed) {
      await this.apiClient.deleteAgeGroup(group.id).toPromise();
      this.selected = null;
      this.loadGroups();
    }
  }

  @Loading(LoaderType.MANAGE_AGE_GROUP)
  public async saveForAll(): Promise<void> {
    const configmed = await this.modal.openConfirm('BackEnd_WikiLanguage.AG_saveAllAreYouSure', 'BackEnd_WikiLanguage.AG_saveAllMessage');

    if (configmed) {
      if (this.selected) {
        await this.manageGroup.save(this.selected.id);
      }
      await this.apiClient.resetAgeGroups().toPromise();
    }
  }

  public newGroup(): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.AG_NewAGPopUpTitle', ManageGroupComponent, {
      disableClose: true,
      ngbOptions: {
        size: 'sm'
      }
    });
    const lastGroup = this.groups[this.groups.length - 1];
    const defaultFrom = lastGroup ? lastGroup.to + 1 : 0;
    const defaultTo = defaultFrom + 1;

    modalData.modalBody.init(undefined, [defaultFrom, defaultTo], valid => modalData.modal.formStatus = valid);

    modalData.modal.save.subscribe(async () => {
      const id = await modalData.modalBody.save(0);
      modalData.modal.close(true);
      await this.loadGroups(id || undefined);
    });
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  ngOnChanges({top}: SimpleChanges): void {
    if (top && top.previousValue && !top.currentValue) {
      sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    }
  }

  ngOnDestroy(): void {
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
  }
}
