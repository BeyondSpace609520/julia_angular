import { Component, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { subscribeToFormStateChange } from '@/app/main/window/shared/forms/utils';
import { weekDays as days } from '@/app/main/window/shared/periods/consts';
import { WeekDay, WeekDayItem } from '@/app/main/window/shared/periods/models';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-type';
import { ChargingSchemeBody, ChargingSchemeCharges, ChargingSchemeDetail, ChargingSchemeType1 } from '../../models';
import { ChargesComponent } from '../shared/charges/charges.component';
import { GeneralComponent } from '../shared/general/general.component';
import { TranslationsComponent } from '../shared/translations/translations.component';
import { Editor } from '../types';
import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

@Component({
  selector: 'app-edit-type1',
  templateUrl: './edit-type1.component.pug',
  styleUrls: ['./edit-type1.component.sass']
})
export class EditType1Component implements Editor, OnInit, OnChanges, OnDestroy {
  private formState = new BehaviorSubject<FormState>({
    valid: true,
    dirty: false,
    touched: false
  });

  @Input() scheme?: ChargingSchemeDetail<ChargingSchemeType1>;
  @Output() formStateChange = this.formState.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged((previous: FormState, current: FormState) => {
      return (
        previous.valid === current.valid
        && previous.dirty === current.dirty
        && previous.touched === current.touched
      );
    })
  );

  weekDays: WeekDayItem[] = days;
  form: FormGroup;
  selectedWeekDay?: WeekDay;
  tabSettings: TabsSettings = {
    buttons: [],
    buttonClasses: ['nav-link']
  };
  activeTabId = '0';

  @ViewChild('general', { static: false }) general: GeneralComponent;
  @ViewChildren('charges') charges: QueryList<ChargesComponent>;
  @ViewChild('translations', { static: false }) translations: TranslationsComponent;

  constructor(
    public loaderService: LoaderService
  ) {}

  get isForPeriod() {
    return (this.form.get('forPeriod') as FormControl).value;
  }

  get chargeLabel() {
    return (this.form.get('chargeType') as FormControl).value === 'PercOnTotal' ? '%' : '€';
  }

  getChargeData(week?: WeekDay): ChargingSchemeCharges | null {
    return this.scheme ? (!week ? Object.values(this.scheme.charges)[0] : this.scheme.charges[week]) : null;
  }

  @Loading(LoaderType.MANAGE)
  async ngOnInit() {
    this.tabSettings.buttons.push(...this.weekDays.map((weekDay, i) => ({ id: String(i), label: weekDay.label })));
  }

  ngOnChanges({ scheme }: SimpleChanges) {
    if (!scheme || scheme.currentValue === scheme.previousValue) { return; }

    this.form = new FormGroup({
      forPeriod: new FormControl(this.scheme ? this.scheme.forPeriod : false),
      chargeType: new FormControl(this.scheme ? this.scheme.chargeType : 'PricePerPersonPerNight'),
      weekDays: new FormArray(this.weekDays.map(({ id }) => new FormControl(this.scheme ? this.scheme.charges[id] : false)))
    });

    subscribeToFormStateChange(this, this.form, this.formState);

    this.selectWeekDay(this.scheme ? Object.keys(this.scheme.charges).pop() as WeekDay : undefined);
  }

  selectWeekDay(id?: WeekDay) {
    this.selectedWeekDay = id;
  }

  public isValid(): Observable<boolean> {
    return merge(this.general.form.valueChanges, this.form.valueChanges, this.translations.form.valueChanges).pipe(
      startWith(null),
      map(() => this.general.form.valid && this.form.valid && this.translations.form.valid)
    );
  }

  public extract(): ChargingSchemeBody<ChargingSchemeDetail<ChargingSchemeType1>> {
    const { name, startDate, endDate } = this.general.extract();
    const { forPeriod, chargeType, weekDays } = this.form.getRawValue();
    const charges = this.charges.toArray();

    return {
      id: this.scheme ? this.scheme.id : undefined,
      translations: this.translations.extract(),
      name,
      startDate,
      endDate,
      charges: this.weekDays.reduce((acc, { id }, i) => !weekDays[i] ? acc : {
        ...acc,
        [id]: this.isForPeriod ? charges[this.weekDays.length].extract() : charges[i].extract()
      }, {}),
      forPeriod,
      chargeType,
      type: 'ExtraChargeOverDayOfWeekPeriod'
    };
  }

  ngOnDestroy() {}
}
