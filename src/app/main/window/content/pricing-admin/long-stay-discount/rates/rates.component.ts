import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiClient } from '@/app/helpers/api-client';
import { Discount } from '@/app/main/window/shared/discount/models';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { LongStayDiscountRate } from '../models';
import { ManageRateComponent } from './manage-rate/manage-rate.component';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.pug',
  styleUrls: ['./rates.component.sass']
})
export class RatesComponent implements OnDestroy {

  @Input() discount!: Discount;
  @Input() rates: LongStayDiscountRate[];
  @Output() edited = new EventEmitter();

  public selectedId: LongStayDiscountRate['id'];
  public formValid = true;

  get selected(): LongStayDiscountRate | null {
    return this.rates.find(r => r.id === this.selectedId) || null;
  }

  get wrongRate(): LongStayDiscountRate | null {
    for (let i = 1; i < this.rates.length; i++) {
      if (this.rates[i - 1].nights.until + 1 !== this.rates[i].nights.from) {
        return this.rates[i];
      }
    }
    return null;
  }

  constructor(
    private modal: ModalService,
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) {}

  selectItem(item: LongStayDiscountRate) {
    this.selectedId = item.id;
  }

  addRate() {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.generic_LongStayDiscount', ManageRateComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert',
      ngbOptions: {
        size: 'sm'
      }
    });

    const maxNights = this.rates && this.rates.length > 0 ? Math.max.apply(Math, this.rates.map(rate => rate.nights.until)) : 0;

    modalData.modalBody.extraFields = false;
    modalData.modalBody.rate = {
      nights: {
        from: maxNights + 1,
        until: maxNights + 2
      }
    } as LongStayDiscountRate;

    modalData.modalBody.formStateChange.pipe(
      untilDestroyed(this)
    ).subscribe(state => {
      modalData.modal.formStatus = state.valid;
    });

    modalData.modal.save.subscribe(async () => {
      await modalData.modalBody.save(0, this.discount.id);
      modalData.modal.close(true);
      this.edited.emit();
    });
  }

  public formStateChanged(state: FormState): void {
    this.formValid = state.valid;
  }

  onSave = () => {
    this.edited.emit();
  }

  @Loading(LoaderType.ITEM)
  async deleteRate(rate: LongStayDiscountRate) {
    await this.apiClient.deleteLongStayDiscountRate(rate.id).toPromise();
    this.edited.emit();
  }

  ngOnDestroy() {}
}
