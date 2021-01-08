import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { CacheService } from '@/app/helpers/cache.service';
import { FormDataService } from '@/app/main/shared/form-data.service';
import { LocalRoomCategory, SpecialOfferPeriodPrice, SpecialOfferPricing } from '../../models';


@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.pug',
  styleUrls: ['./prices.component.sass']
})
export class PricesComponent implements OnInit, OnChanges, OnDestroy {
  private allValidSubject = new BehaviorSubject<boolean>(true);

  @Input() prices!: SpecialOfferPricing['prices'];
  @Input() ageGroups!: SpecialOfferPricing['ageGroups'];
  @Input() individualCatering!: boolean;
  @Output() allValid: Observable<boolean> = this.allValidSubject.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged()
  );

  public categories: LocalRoomCategory[];
  public extended = false;
  public validity: FieldValidity[] = [];

  constructor(
    private formDataService: FormDataService,
    private cacheService: CacheService,
  ) { }

  public getCategoryPrices(option: LocalRoomCategory): SpecialOfferPeriodPrice | undefined {
    return this.prices.find(p => p.categoryId === +option.id);
  }

  public findGroup(item: SpecialOfferPeriodPrice, index: number): SpecialOfferPeriodPrice['ages'][0] {
    if (!item.ages[index]) {
      item.ages.splice(index, 0, { price: 0, charge: 0 });
    }

    return item.ages[index];
  }

  public onInputValidityChange(input: string, categoryId: LocalRoomCategory['id'], valid: boolean): void {
    this.saveValidity(input, categoryId, valid);
    this.allValidSubject.next(this.validity.every(validity => validity.valid));
  }

  public updateCategoryPricing(category: LocalRoomCategory, checked: boolean): void {
    const exist = this.getCategoryPrices(category);

    if (checked && !exist) {
      this.prices.push({
        categoryId: +category.id,
        adult: {
          price: 0,
          charge: 0
        },
        ages: [],
        cateringQuota: 0
      });
    }
    if (!checked && exist) {
      this.prices.splice(this.prices.indexOf(exist), 1);
    }
  }

  private getValidity(input: string, categoryId: LocalRoomCategory['id']): FieldValidity {
    const existing = this.validity.find(validity => validity.input === input && validity.categoryId === categoryId);
    if (existing) {
      return existing;
    }
    const newField: FieldValidity = {
      input,
      categoryId,
      valid: true
    };
    this.validity.push(newField);
    return newField;
  }

  private saveValidity(input: string, categoryId: LocalRoomCategory['id'], valid: boolean): void {
    const validity = this.getValidity(input, categoryId);
    validity.valid = valid;
  }

  private async setExtended(): Promise<void> {
    const {c_methodDefaultCatering} = await this.cacheService.getCompanyDetails();
    this.extended = this.individualCatering || c_methodDefaultCatering === 'quota';
  }

  private checkAndFixPriceAges(): void {
    this.prices.forEach(price => {
      if (price.ages.length > this.ageGroups.length) {
        price.ages.splice(this.ageGroups.length);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.categories = await this.cacheService.getLocalRoomCategories();
  }

  ngOnChanges({individualCatering, ageGroups}: SimpleChanges): void {
    if (individualCatering) {
      this.setExtended();
    }
    if (ageGroups) {
      this.checkAndFixPriceAges();
    }
  }

  ngOnDestroy(): void {}
}

interface FieldValidity {
  input: string;
  categoryId: LocalRoomCategory['id'];
  valid: boolean;
}
