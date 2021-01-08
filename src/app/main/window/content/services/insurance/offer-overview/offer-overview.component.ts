import { Component } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { SearchData } from '@/app/main/window/shared/search-bar/search-bar.component';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { Contract } from '../models';
import { prepareOffersParams, reduceContract } from '../reduce';
import { openKeyValueModal } from './key-value-modal/helper';
import { InsuranceType } from './key-value-modal/key-value-modal.component';

@Component({
  selector: 'app-offer-overview',
  templateUrl: './offer-overview.component.pug',
  styleUrls: ['./offer-overview.component.sass']
})
export class OfferOverviewComponent {

  offers: Contract[] = [];
  offerDropdown: { id: InsuranceType, label: string }[] = [
    { id: 'offerRequest',  label: 'Offer Request' },
    { id: 'offerResponse', label: 'Offer Response' },
  ];
  contractDropdown = [
    { id: 'contractRequest', label: 'Contract Request' },
    { id: 'contractResponse', label: 'Contract Response' },
  ];
  isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modalService: ModalService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.OFFERS);
  }

  openKeyValueModal(type: InsuranceType, id: number): void {
    openKeyValueModal(id, type, this.modalService);
  }

  @Loading(LoaderType.OFFERS)
  async onSearch(searchData: SearchData): Promise<void> {
    const offers = await this.apiClient.getInsuranceOffers(prepareOffersParams(searchData)).toPromise();

    this.offers = offers.map(reduceContract);
  }

  // TODO replace function with pipe or static variable
  offerHighlighted(item: Contract): boolean {
    return item.offerCode !== null;
  }

  // TODO replace function with pipe or static variable
  offerTooltip(item: Contract): string | null {
    if (!this.offerHighlighted(item)) { return null; }

    return `${item.offerCode}\n${item.offerCodeText}\n${item.offerCodeTextText}`;
  }

  // TODO replace function with pipe or static variable
  contractHighlighted(item: Contract): boolean {
    return Boolean(item.contractCodeText);
  }

  // TODO replace function with pipe or static variable
  contractTooltip(item: Contract): string | null {
    if (!this.contractHighlighted(item)) { return null; }

    return `${item.contractCodeText}\n${item.contractParameter}`;
  }
}
