import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { companyDetails } from '@/app/main/window/content/channel-management/enquiry-pool/company-info';
import { LoaderType } from '@/app/main/window/content/channel-management/enquiry-pool/loader-types';
import { Enquiry } from '@/app/main/window/content/channel-management/enquiry-pool/models';
import { prepareGetParams, reduceEnquiry } from '@/app/main/window/content/channel-management/enquiry-pool/reduce';
import { SearchData } from '@/app/main/window/shared/search-bar/search-bar.component';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

@Component({
  selector: 'app-easybooking-enquiry-pool',
  templateUrl: './easybooking-enquiry-pool.component.pug',
  styleUrls: ['./easybooking-enquiry-pool.component.sass']
})
export class EasybookingEnquiryPoolComponent {

  @Input() fromDate?: Date;
  @Input() untilDate?: Date;

  public searchCheckboxes = [
    { id: 'autoAnswered',  label: 'BackEnd_WikiLanguage.EQP_autoAnswered', value: true },
    { id: 'answered', label: 'BackEnd_WikiLanguage.EQP_answered' },
    { id: 'open', label: 'BackEnd_WikiLanguage.EQP_openEnquiries', value: true },
    { id: 'declined', label: 'BackEnd_WikiLanguage.EQP_declinedEnquiries' },
  ];
  public filterOptions = [
    { name: 'BackEnd_WikiLanguage.EQP_incomingDate', value: 'inputDate' },
    { name: 'BackEnd_WikiLanguage.EQP_arrival', value: 'arrivalDate' }
  ];
  public dateFilterOption = new FormControl('inputDate');
  public enquiries: Enquiry[] = [];
  public isContentLoading: Observable<boolean>;

  private lastSearchData: SearchData;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private translate: TranslateService,
  ) {
    this.isContentLoading = this.loaderService.isLoadingAnyOf([LoaderType.SEARCH, LoaderType.ACTION]);
  }

  @Loading(LoaderType.SEARCH)
  public async onSearch(data: SearchData): Promise<void> {
    const params = prepareGetParams(data, this.dateFilterOption.value);

    const rawEnquiries = await this.apiClient.getEnquiries(params).toPromise();

    this.lastSearchData = data;
    this.enquiries = rawEnquiries.map(reduceEnquiry);
    this.enquiries.map(async en => en.companyInfo = await this.prepareCompanyInfo(en));
  }

  async updateList() {
    if (!this.lastSearchData) { throw new Error('lastSearchData not defined'); }
    await this.onSearch(this.lastSearchData);
  }

  // TODO replace function with pipe
  public getStatus(item: Enquiry): {icon: string, tooltip: string} | null {
    switch (item.status) {
      case 'automatic':
        return { icon: 'mdi-check', tooltip: 'BackEnd_WikiLanguage.EQP_statusAutomatic' };
      case 'manual':
        return { icon: 'mdi-keyboard-backspace', tooltip: 'BackEnd_WikiLanguage.EQP_statusManual' };
      case 'openEnquiry':
        return { icon: 'mdi-cached', tooltip: 'BackEnd_WikiLanguage.EQP_statusOpenEnquiry' };
      case 'cancelled':
        return { icon: 'mdi-cancel', tooltip: 'BackEnd_WikiLanguage.EQP_statusCancelled' };
      default:
        return null;
    }
  }

  // TODO replace function with pipe
  public isHighlighted(item: Enquiry): boolean {
    const id = item.bookingStatusId;

    return id !== null && (id === 2 || id === 3);
  }

  private async prepareCompanyInfo(enquiry: Enquiry): Promise<string> {
    return (await Promise.all(companyDetails(enquiry)
        .filter(item => item)
        .map(async item => {
          if (typeof item === 'string') { return item; }

          const translatedLabel = await this.translate.get(item[0]).toPromise();
          const label = translatedLabel.replace(/:*\ *$/, ''); // delete ':' at the end of translated text
          const value = item[1];

          return `${label}: ${value}`;
        }))
    ).join('\n');
  }

}
