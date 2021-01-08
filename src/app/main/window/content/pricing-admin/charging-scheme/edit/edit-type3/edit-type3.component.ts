import { Component, Input, ViewChild, ViewChildren, QueryList, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { RoomCategory } from '../../../../room-admin/room-category/models';
import { LoaderType } from '../../loader-type';
import { ChargingSchemeBody, ChargingSchemeDetail, ChargingSchemeType3 } from '../../models';
import { ChargesComponent } from '../shared/charges/charges.component';
import { GeneralComponent } from '../shared/general/general.component';
import { TranslationsComponent } from '../shared/translations/translations.component';
import { Editor } from '../types';
import { Observable, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-type3',
  templateUrl: './edit-type3.component.pug',
  styleUrls: ['./edit-type3.component.sass']
})
export class EditType3Component implements Editor, OnInit, OnChanges {

  @Input() scheme?: ChargingSchemeDetail<ChargingSchemeType3>;

  @ViewChild('general', { static: false }) general: GeneralComponent;
  @ViewChildren('charges') charges: QueryList<ChargesComponent>;
  @ViewChild('translations', { static: false }) translations: TranslationsComponent;

  form: FormGroup;
  roomCategories: RoomCategory[] = [];

  tabSettings: TabsSettings = {
    buttons: [],
    buttonClasses: ['nav-link']
  };
  activeTabId = '0';

  constructor(
    public loaderService: LoaderService,
    private apiClient: ApiClient
  ) {}

  getChargeData(roomCategoryId: RoomCategory['id']) {
    return this.scheme ? this.scheme.charges[roomCategoryId] : null;
  }

  @Loading(LoaderType.MANAGE)
  async ngOnInit() {
    this.roomCategories = await this.apiClient.getRoomCategories().toPromise();

    this.tabSettings.buttons.push(...this.roomCategories.map((category, i) => ({ id: String(i), label: category.name })));
    this.loadForm(this.scheme);
  }

  ngOnChanges({ scheme }: SimpleChanges) {
    if (scheme && scheme.currentValue !== scheme.previousValue) {
      this.loadForm(this.scheme);
    }
  }

  loadForm(scheme?: ChargingSchemeType3) {
    this.form = new FormGroup({
      nights: new FormControl(scheme ? scheme.nights : 0),
      categoryCharges: new FormArray(this.roomCategories.map(c => new FormControl(scheme ? Boolean(scheme.charges[c.id]) : false)))
    });
  }

  public isValid(): Observable<boolean> {
    return merge(this.general.form.valueChanges, this.form.valueChanges, this.translations.form.valueChanges).pipe(
      startWith(null),
      map(() => this.general.form.valid && this.form.valid && this.translations.form.valid)
    );
  }

  public extract(): ChargingSchemeBody<ChargingSchemeDetail<ChargingSchemeType3>> {
    const { name, startDate, endDate } = this.general.extract();
    const { nights } = this.form.getRawValue();
    const charges = this.charges.toArray();

    return {
      id: this.scheme ? this.scheme.id : undefined,
      translations: this.translations.extract(),
      name,
      startDate,
      charges: this.roomCategories.reduce((acc, { id }, i) => {
        const active = (this.form.get('categoryCharges') as FormArray).at(i).value;

        if (!active) { return acc; }
        return {
          ...acc,
          [id]: charges[i].extract()
        };
      }, {}),
      endDate,
      nights,
      type: 'FixedAmountOnNightsStay'
    };
  }
}
