import { focusRoomplan } from '@/app/main/window/content/calendar/calendar-html/focusRoomplan';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { ViewService } from '@/app/main/view/view.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { MoveToRoomplanEvent } from '../../content/calendar/calendar-html/events';
import { redirectWithPOST } from '../../utils';
import { EventBusService } from '../event-bus';
import { SearchData } from '../search-bar/search-bar.component';
import { LoaderType } from './loader.types';
import { Interaction, InteractionColumn, InteractionFilter } from './models';

@Component({
  selector: 'app-shared-interaction',
  templateUrl: './interaction.component.pug',
  styleUrls: ['./interaction.component.sass']
})
export class InteractionComponent implements OnChanges {

  @Input() filter: InteractionFilter = {};
  @Input() columns: InteractionColumn[];

  searchCheckboxes = [
    { id: 'enquiries',  label: 'BackEnd_WikiLanguage.interactionReport_ShowEnquiries', value: true },
    { id: 'reservations', label: 'BackEnd_WikiLanguage.interactionReport_ShowReservations', value: true },
    { id: 'booking', label: 'BackEnd_WikiLanguage.interactionReport_ShowBookings' },
    { id: 'admin', label: 'BackEnd_WikiLanguage.interactionReport_ShowAdmin' },
    { id: 'workflow', label: 'BackEnd_WikiLanguage.interactionReport_ShowWorkflow' },
  ];

  items: Interaction[] = [];
  lastSearchData?: SearchData;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private eventBus: EventBusService,
    private modalService: ModalService,
    private viewService: ViewService,
  ) { }

  isSearching() {
    return this.loaderService.isActive(LoaderType.SEARCH) || this.loaderService.isActive(LoaderType.PDF);
  }

  @Loading(LoaderType.SEARCH)
  async onSearch(searchData: SearchData) {
    this.items = await this.apiClient.getInteractionList({ ...searchData, ...this.filter }).toPromise();
    this.lastSearchData = searchData;
  }

  async openRoomplan(item: Interaction) {
    await focusRoomplan(this.viewService);

    this.eventBus.emit<MoveToRoomplanEvent>('moveToRoomplan', {
      arrivalDate: item.fromDate,
      id: item.bookingId,
      type: item.bsName
    });
  }

  viewEmail(item: Interaction) {
    redirectWithPOST(environment.remoteUrl + '/wo/Services/com/showHTML.php', {
      interactionText: item.text
    });
  }

  async resendEmail(item: Interaction) {
    const confirmed = await this.modalService.openConfirm('BackEnd_WikiLanguage.CCAI_ConfirmResendMessage', '', {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Yes',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_No',
      disableClose: true
    });

    if (confirmed) {
      await this.apiClient.resendInteraction(item).toPromise();
    }
  }

  @Loading(LoaderType.PDF)
  async previewPDF(item: Interaction) {
    // https://trello.com/c/TOjximeh/40-customer-admin-guest-interaction "Icon 4" paragraph
    const absolutePath = item.stdAttachmentPath.replace(/^FILENOTFOUND/, '');
    const domainPath =  absolutePath.replace('/var/www/html', '');
    const fileNotFound = item.stdAttachmentPath.startsWith('FILENOTFOUND');

    if (fileNotFound && absolutePath) {
      await this.apiClient.restoreInteractionPDF(absolutePath).toPromise();
      item.stdAttachmentPath = absolutePath;
    }

    if (domainPath) {
      window.open(environment.remoteUrl + domainPath, '_blank');
    }
  }

  ngOnChanges({ filter }: SimpleChanges) {
    if (filter && filter.previousValue && filter.currentValue.customerId !== filter.previousValue.customerId) {
      if (this.lastSearchData) {
        this.onSearch(this.lastSearchData);
      }
    }
  }
}
