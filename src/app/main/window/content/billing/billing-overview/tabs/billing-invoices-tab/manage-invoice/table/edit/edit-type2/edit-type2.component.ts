import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { LoaderService } from '@/app/shared/loader.service';
import { Invoice, VersionDetail } from '../../../models';
import { EditInvoiceComponent } from '../modal.component';

@Component({
  selector: 'app-edit-type2',
  templateUrl: './edit-type2.component.pug',
  styleUrls: ['../../table.component.sass']
})
export class EditType2Component extends EditInvoiceComponent implements OnDestroy {

  public invoiceText = new FormControl('');
  public alternativeText = new FormControl('');
  public unitPriceGross = new FormControl(0);
  public unitCount = new FormControl('');
  public pricesEditable = false;

  constructor(loaderService: LoaderService, apiClient: ApiClient) {
    super(loaderService, apiClient);
  }

  public init(detail: VersionDetail, invoice: Invoice): void {
    console.log('init', detail.totalNet, detail.totalTax);
    super.init(detail, invoice);
    this.pricesEditable = detail.type === 'CancellationFee';
    this.invoiceText.setValue(detail.invoiceText);
    this.alternativeText.setValue(detail.alternativeText);
    this.unitPriceGross.setValue(detail.unitPriceGross);
    this.unitCount.setValue(detail.unitCount);

    this.unitPriceGross.valueChanges.pipe(untilDestroyed(this), distinctUntilChanged()).subscribe(value => this.unitPriceChanged(+value));
    this.unitCount.valueChanges.pipe(untilDestroyed(this), distinctUntilChanged()).subscribe(value => this.unitCountChanged(+value));

  }

  public extractDetail(): VersionDetail {
    return {
      ...super.extractDetail(),
      invoiceText: this.invoiceText.value,
      alternativeText: this.alternativeText.value,
      unitPriceGross: +this.unitPriceGross.value,
      unitCount: +this.unitCount.value,
    };
  }

  private unitPriceChanged(unitPrice: number): void {
    if (isNaN(unitPrice)) {
      return;
    }
    this.calculateTotalPrices(unitPrice, +this.unitCount.value);
  }

  private unitCountChanged(unitCount: number): void {
    if (isNaN(unitCount)) {
      return;
    }
    this.calculateTotalPrices(+this.unitPriceGross.value, unitCount);
  }

  private calculateTotalPrices(unitPrice: number, unitCount: number): void {
    const taxPercent = +this.detail.taxPerc || 0;
    this.detail.totalGross = unitCount * unitPrice;
    this.detail.totalNet = roundWithDecimals(this.detail.totalGross * (100 - taxPercent) / 100);
    this.detail.totalTax = this.detail.totalGross - this.detail.totalNet;
  }

  ngOnDestroy(): void {}
}

function roundWithDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
