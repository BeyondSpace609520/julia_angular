import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';

import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { conditionalRequired } from '@/app/main/window/shared/forms/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { TabComponent } from '../tab';
import { CustomerRating, Factor } from './models';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.pug',
  styleUrls: ['./rating.component.sass']
})
export class RatingComponent extends TabComponent implements OnChanges {

  factors: Factor[] = [
    { id: 'behavior', label: 'BackEnd_WikiLanguage.ratingBehavior' },
    { id: 'payment', label: 'BackEnd_WikiLanguage.ratingPaymentWilling' },
    { id: 'rules', label: 'BackEnd_WikiLanguage.ratingRespectedHouseRules' },
    { id: 'cleanliness', label: 'BackEnd_WikiLanguage.ratingCleanliness' },
    { id: 'costs', label: 'BackEnd_WikiLanguage.ratingServiceCosts' },
    { id: 'vip', label: 'BackEnd_WikiLanguage.ratingVipFactor' },
  ];
  rating: CustomerRating;
  form: FormGroup;

  get hasAdditionalInfo() {
    const useNetworkRating = this.mainService.getCompanyDetails().c_grUseNetworkRatings === 'on';

    return this.rating && useNetworkRating && this.rating.countOfReviews > 0;
  }

  constructor(
    public loaderService: LoaderService,
    private apiClient: ApiClient,
    private mainService: MainService
  ) {
    super();
  }

  async ngOnChanges({ item }: SimpleChanges) {
    if (item && item.currentValue !== item.previousValue) {
      this.load();
    }
  }

  @Loading(LoaderType.TAB)
  async load() {
    const { dbName } = this.mainService.getCompanyDetails();
    const rating = this.rating = await this.apiClient.getCustomerRating(this.item.id, dbName).toPromise();

    const factors = new FormGroup({
      behavior: new FormControl(rating.factors.behavior),
      payment: new FormControl(rating.factors.payment),
      rules: new FormControl(rating.factors.rules),
      cleanliness: new FormControl(rating.factors.cleanliness),
      costs: new FormControl(rating.factors.costs),
      vip: new FormControl(rating.factors.vip),
    });
    const comment = new FormControl(rating.comment);
    const thumb = new FormControl(rating.thumb);

    // tslint:disable-next-line: max-line-length
    const rateSetted = factors.valueChanges.pipe(startWith(factors.getRawValue()), map(factorsValue => Object.values(factorsValue).filter(r => r).length > 0));
    const thumbSetted = thumb.valueChanges.pipe(startWith(thumb.value), map(value => value === 'up' || value === 'down'));

    comment.setValidators([conditionalRequired(
      combineLatest(rateSetted, thumbSetted).pipe(map(([rate, th]) => !rate && !th))
    )]);

    this.form = new FormGroup({
      factors,
      comment,
      thumb
    });
  }

  onRatingChange(factorId: Factor['id'], e: { rating: number }) {
    const factors = this.form.get('factors') as AbstractControl;
    const factor = factors.get(factorId) as AbstractControl;
    const current = factor.value as number;
    const next = current === e.rating && current === 1 ? 0 : e.rating; // reset stars if 1 is selected repeatedly

    factor.setValue(next);
  }

  averageRating() {
    if (!this.form) { return 0; }

    const factors: number[] = Object.values(this.extractForm().factors).filter(r => r); // rates for only rated factors

    return factors.length ? Math.round(factors.reduce((a, b) => a + b) / factors.length) : 0;
  }

  extractForm(): CustomerRating {
    return this.form.getRawValue();
  }

  cancel() {
    this.load();
  }

  @Loading(LoaderType.TAB)
  async save() {
    const { dbName } = this.mainService.getCompanyDetails();
    const rating = this.extractForm();

    await this.apiClient.saveCustomerRating(this.item.id, rating, dbName).toPromise();
    this.load();
  }
}
