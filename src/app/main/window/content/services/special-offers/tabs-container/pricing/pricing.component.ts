import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { checkAllCheckboxes, normalizeInterval } from '@/app/main/window/shared/forms/utils';
import { weekDays } from '@/app/main/window/shared/periods/consts';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { SendToRoomplanEvent } from '../../../../calendar/calendar-html/events';
import { LoaderType } from '../../loader-types';
import { SpecialOffer, SpecialOfferPricing } from '../../models';
import { PeriodsComponent } from './periods/periods.component';


@Component({
  selector: 'app-pricing-tab',
  templateUrl: './pricing.component.pug',
  styleUrls: ['./pricing.component.sass']
})
export class PricingComponent implements OnChanges {

  @Input() offer!: SpecialOffer;
  @Output() saved = new EventEmitter();

  public details: SpecialOfferPricing;
  public form: FormGroup;
  public weekDays = weekDays;
  public validity: {
    validRange: boolean,
    bookableRange: boolean,
    prices: boolean,
    ageGroups: boolean
  } = {
    validRange: true,
    bookableRange: true,
    prices: true,
    ageGroups: true
  };

  public isSaveEnabled = true;

  @ViewChild('periodsComponent', { static: false }) public periodsComponent!: PeriodsComponent;

  constructor(
    private apiClient: ApiClient,
    private mainService: MainService,
    public loaderService: LoaderService,
    private eventBus: EventBusService
  ) { }

  @Loading(LoaderType.LOAD_TAB)
  public async load(): Promise<void> {
    this.details = await this.apiClient.getSpecialOfferPricingDetail(this.offer).toPromise();
    this.loadForm();
  }

  public loadForm(): void {
    const company = this.mainService.getCompanyDetails();
    const quotaCatering = company.c_methodDefaultCatering === 'quota';

    const fromDate = new FormControl(this.details.offer.fromDate);
    const untilDate = new FormControl(this.details.offer.untilDate);
    const nightsStay = new FormControl(this.details.offer.nightsStay || 7);
    const allArrival = new FormControl(Object.values(this.details.offer.days).every(checked => checked));
    const daysArrival = new FormArray(this.weekDays.map(d => new FormControl(this.details.offer.days[d.id])));
    const autoCosts = new FormControl({ value: this.details.offer.individualCatering || quotaCatering, disabled: quotaCatering });
    const minPersons = new FormControl(this.details.offer.minPersons || 2);
    const maxPersons = new FormControl(this.details.offer.maxPersons || 2);

    this.form = new FormGroup({
      fromDate,
      untilDate,
      bookableFromDate: new FormControl(this.details.offer.bookableFromDate),
      bookableUntilDate: new FormControl(this.details.offer.bookableUntilDate),
      autoCosts,
      nightsStay,
      minPersons,
      maxPersons,
      arrival: new FormGroup({
        all: allArrival,
        days: daysArrival
      })
    });

    autoCosts.valueChanges.subscribe(enabled => this.setIndividualCatering(enabled));
    normalizeInterval(minPersons, maxPersons);
    checkAllCheckboxes(allArrival, daysArrival);
  }

  @Loading(LoaderType.LOAD_TAB)
  async setIndividualCatering(enabled: boolean): Promise<void> {
    await this.apiClient.setIndividualCatering(this.details.offer, enabled).toPromise();
    this.details.offer.individualCatering = enabled;
    this.offer.individualCatering = enabled;
    this.notifyRoomplan();
  }

  @Loading(LoaderType.LOAD_TAB)
  async save(forAll = false): Promise<void> {
    const {
      fromDate, untilDate,
      bookableFromDate, bookableUntilDate,
      autoCosts: individualCatering,
      nightsStay, minPersons, maxPersons,
      arrival
    } = this.form.getRawValue();
    const offer: SpecialOffer = {
      ...this.details.offer,
      fromDate, untilDate,
      bookableFromDate, bookableUntilDate,
      individualCatering,
      nightsStay, minPersons, maxPersons,
      days: {
        mo: arrival.days[0],
        tu: arrival.days[1],
        we: arrival.days[2],
        th: arrival.days[3],
        fr: arrival.days[4],
        sa: arrival.days[5],
        su: arrival.days[6],
      },
    };
    await this.apiClient.saveSpecialOfferPricing(offer, this.details, forAll).toPromise();
    this.notifyRoomplan();
    this.saved.emit();
  }

  public notifyRoomplan(): void { // TODO c&p
    this.eventBus.emit<SendToRoomplanEvent>('sendToRoomplan', { method: 'specialOfferAdminChanged', object: { status: 'ok' }});
  }

  public onValidityChange(component: 'validRange' | 'bookableRange' | 'prices' | 'ageGroups', valid: boolean): void {
    this.validity[component] = valid;
    this.isSaveEnabled = this.validity.validRange && this.validity.bookableRange && this.validity.prices && this.validity.ageGroups;
  }

  ngOnChanges({ offer }: SimpleChanges): void {
    if (offer && offer.previousValue !== offer.currentValue) {
      this.load();
    }
  }
}
