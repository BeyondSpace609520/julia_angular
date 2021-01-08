import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { sendRoomplanUpdate } from '@/app/main/window/content/calendar/calendar-html/sendRoomplanUpdate';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { conditionalRequired } from '../../../shared/forms/utils';
import { LoaderType } from './loader-types';
import { ExtraCharge, ExtraChargeDetails, ExtraChargeLocale, ExtraChargeRequestBody } from './models';

@Component({
  selector: 'app-extra-charges',
  templateUrl: './extra-charges.component.pug',
  styleUrls: ['./extra-charges.component.sass']
})
export class ExtraChargesComponent implements OnInit, OnDestroy {

  charges: ExtraCharge[] = [];
  selected: ExtraCharge;
  form: FormGroup;
  locales: FormOption[] = [];
  isLoading: Observable<boolean>;

  private selectedDetails: ExtraChargeDetails;

  // TODO replace getter function with pipe or static variable
  get hasValueField() {
    return this.selected.type === 'baby-bed' || this.selected.type === 'parking';
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private formData: FormDataService,
    private eventBusService: EventBusService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_CHARGES);
    this.locales = this.formData.getLocals();
  }

  @Loading(LoaderType.LOAD_CHARGES)
  async selectItem(charge: ExtraCharge): Promise<void> {
    this.selectedDetails = await this.apiClient.getChargeDetails(charge.id).toPromise();
    this.selected = charge;

    const activeControl = new FormControl(this.selectedDetails.active);

    this.form = new FormGroup({
      active: activeControl,
      price: new FormControl(this.selectedDetails.price, [conditionalRequired(activeControl.valueChanges)]),
      value: new FormControl(this.selectedDetails.value, this.hasValueField ? [conditionalRequired(activeControl.valueChanges)] : []),
      chargeDaily: new FormControl(this.selectedDetails.chargeDaily),
      locales: new FormArray(this.locales.map(locale => {
        const chargeLocale = this.getOrCreateLocaleData(+locale.value);

        return new FormControl(chargeLocale.text);
      }))
    });
  }

  @Loading(LoaderType.LOAD_CHARGES)
  async save(): Promise<void> {
    const data = this.form.getRawValue();
    const details: ExtraChargeRequestBody = {
      id: this.selected.id,
      active: data.active,
      chargeDaily: data.chargeDaily,
      price: data.price,
      priceIncludedAppartment: this.selected.priceIncludedAppartment,
      priceIncludedStandardRoom: this.selected.priceIncludedStandardRoom,
      value: data.value,
      locales: this.locales.map((locale, i) => {
        return {
          item: this.selectedDetails.locales.find(l => l.localeId === +locale.value),
          text: (this.form.get('locales') as FormArray).controls[i].value
        };
      }).filter(l => l.item).map(({ item, text }: { item: ExtraChargeDetails['locales'][0], text: string }) => {
        return {
          id: item.id,
          localeId: item.localeId,
          otherChargeId: item.otherChargeId,
          text
        } as ExtraChargeRequestBody['locales'][0];
      })
    };

    await this.apiClient.saveChargeDetails(details).toPromise();
    sendRoomplanUpdate(this.eventBusService, 'generalSettingsChanged');
    sendRoomplanUpdate(this.eventBusService, 'priceAdminChanged');
    await this.loadCharges();
  }

  @Loading(LoaderType.LOAD_CHARGES)
  private async loadCharges(): Promise<void> {
    this.charges = await this.apiClient.getCharges().toPromise();
  }

  private getOrCreateLocaleData(localeId: number): ExtraChargeLocale {
    const localeData = this.selectedDetails.locales.find(l => l.localeId === localeId);
    if (localeData) {
      return localeData;
    }
    const newLocaleData: ExtraChargeLocale = {
      id: null,
      localeId,
      otherChargeId: this.selectedDetails.id,
      text: ''
    };
    this.selectedDetails.locales.push(newLocaleData);
    return newLocaleData;
  }

  ngOnInit() {
    this.loadCharges();
  }

  ngOnDestroy() {}
}
