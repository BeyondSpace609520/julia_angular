import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { Contract } from '../models';
import { reduceContract } from '../reduce';

@Component({
  selector: 'app-contract-summary',
  templateUrl: './contract-summary.component.pug',
  styleUrls: ['./contract-summary.component.sass']
})
export class ContractSummaryComponent implements OnDestroy {

  months: string[];
  month = new FormControl();
  contracts: Contract[];
  isLoading: Observable<boolean>;

  constructor(private apiClient: ApiClient, private loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.SUMMARY);
    this.loadMonths();
    this.month.valueChanges.pipe(untilDestroyed(this)).subscribe(month => {
      this.loadSummary(month);
    });
  }

  @Loading(LoaderType.SUMMARY)
  async loadMonths(): Promise<void> {
    this.months = await this.apiClient.getInsuranceMonths().toPromise();
    this.month.setValue(this.months[0]);
  }

  @Loading(LoaderType.SUMMARY)
  async loadSummary(month: string): Promise<void> {
    const contracts = await this.apiClient.getInsuranceSummary(month).toPromise();

    this.contracts = contracts.map(reduceContract);
  }

  getTotal(field: string): number {
    return this.contracts && this.contracts.reduce((sum, contract) => sum + contract[field], 0);
  }

  ngOnDestroy(): void {}
}
