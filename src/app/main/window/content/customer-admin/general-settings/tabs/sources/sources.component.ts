import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Trigger } from '@/app/main/models';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { openInsertModal } from '@/app/main/window/shared/insert-modal/insert-modal';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { UpdateRoomplanEvent } from '../../../../calendar/calendar-html/events';
import { LoaderType } from '../../loader-types';
import { BookingSource } from '../../models';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.pug',
  styleUrls: ['./sources.component.sass']
})
export class SourcesComponent {

  public sources: BookingSource[];
  public form: FormGroup;
  public isLoading: Observable<boolean>;

  private initialSourceIds: string[]; // delete on save

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private eventBusService: EventBusService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.SOURCES);
  }

  // TODO replace getter function with pipe or static variable
  get groupArray() {
    return (this.form.get('formArray') as FormArray).controls;
  }

  // TODO replace getter function with pipe or static variable
  isType1(source: BookingSource) {
    return ['Test Booking', 'Website', 'Enquiry Pool', 'Holidays on the Farm'].includes(source.cbs_description);
  }

  @Loading(LoaderType.SOURCES)
  public async load(langId: number): Promise<void> {
    this.sources = await this.apiClient.getCustomBookingSources(true, langId).toPromise();
    this.initialSourceIds = this.sources.map(s => s.cbs_id);
    this.form = new FormGroup({
      formArray: new FormArray(this.sources.map(s => new FormGroup({
        checkbox: new FormControl(s.cbs_show === 'on'),
        value: new FormControl(s.cbsl_value, [Validators.required])
      })))
    });
  }

  public deleteItem(source: BookingSource): void {
    const i = this.sources.indexOf(source);

    this.sources.splice(i, 1);
    (this.form.get('formArray') as FormArray).removeAt(i);
  }

  @Loading(LoaderType.SOURCES)
  public async save(langId: number): Promise<void> {
    // https://trello.com/c/tpyfQQmT/39-customeradmin-screen-settings-tab6-sources
    if (!this.form.valid) {
      return;
    } // Check 1

    const changedSources = this.sources.map((source, i) => {
      const group = this.groupArray[i];

      return {
        ...source,
        cbs_show: (group.get('checkbox') as FormControl).value ? 'on' : 'off' as Trigger,
        cbsl_value: (group.get('value') as FormControl).value as string
      };
    });

    await this.apiClient.saveBookingSources(changedSources, this.getDeletedIds(), langId).toPromise();
    this.eventBusService.emit<UpdateRoomplanEvent>('updateRoomplanWindows', null);
    sendRoomplanUpdate(this.eventBusService, 'refreshBookingSources');
  }

  public addItem(langId: number): void {
    openInsertModal(
      this.modalService,
      'BackEnd_WikiLanguage.newSourceTitle',
      'BackEnd_WikiLanguage.MW_ConfigName',
      async (name: string) => {
        await this.apiClient.newBookingSources(name).toPromise();
        sendRoomplanUpdate(this.eventBusService, 'refreshBookingSources');
        await this.load(langId);

        return true;
      }
    );
  }

  private getDeletedIds(): string[] {
    return this.initialSourceIds.filter(id => !this.sources.some(s => s.cbs_id === id));
  }

}
