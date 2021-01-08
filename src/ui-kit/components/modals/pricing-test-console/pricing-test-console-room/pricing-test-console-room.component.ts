import { SeasonPeriod } from '@/app/main/window/content/pricing-admin/season-periods/models';
import {
  RawRefreshShoppingCartPrices,
  RefreshShoppingCartPrices,
  ServiceTypeForPeriod
} from '@/ui-kit/components/modals/pricing-test-console/models';
import dayjs from 'dayjs';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { addDays, differenceInYears, subYears } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-pricing-test-console-room',
  templateUrl: './pricing-test-console-room.component.html',
  styleUrls: ['./pricing-test-console-room.component.sass']
})
export class PricingTestConsoleRoomComponent implements OnInit, OnDestroy {
  @Input() categoryModal: boolean;
  @Input() period: SeasonPeriod;
  @Input() categoryRooms: {e_id: number, e_uniqueNo: string}[];
  @Input() serviceTypes: ServiceTypeForPeriod[];
  @Input() minPerson: number;
  @Input() maxPerson: number;
  @Input() actualRoomId: number;
  @Input() maxGarages: number;
  @Input() maxCots: number;
  @Input() onChangeDone: EventEmitter<void>;

  @Output() onChange = new EventEmitter<RefreshShoppingCartPrices>();

  public adultsNum: number;
  public childrenNum: number;
  public actualMaxPerson: number;
  public form: FormGroup;

  public showParkingSpace = false;
  public showBabyBed = false;

  private prevData: RefreshShoppingCartPrices;
  private minDateForChildren: Date;
  private maxDateForChildren: Date;

  constructor() {}

  private setCheckboxVisibilities() {
    this.showParkingSpace = (this.maxGarages > 0);
    this.showBabyBed = false;
    if (this.maxCots > 0) {
      const fromDate = (this.form.get('fromDate') as FormArray).value;
      (this.form.get('childrenAges') as FormArray).controls.forEach((child) => {
        const age = differenceInYears(fromDate, child.value);
        if (age < 4) {
          this.showBabyBed = true;
        }
      });
    }
  }

  private setMinDateForChildren() {
    this.minDateForChildren = addDays(subYears(this.period.fromDate, 18), 1);
    this.maxDateForChildren = this.period.untilDate;
  }

  private setActualMaxPerson() {
    this.actualMaxPerson = (this.maxPerson - (this.adultsNum + this.childrenNum) <= 0) ? 0 : this.maxPerson - (this.adultsNum + this.childrenNum);
  }

  private setChildrenAgeControl() {
    const prevFormArraySize = (this.form.get('childrenAges') as FormArray).length;
    if (this.childrenNum !== prevFormArraySize) {
      if (this.childrenNum > prevFormArraySize) {
        for(let i = 0; i < this.childrenNum; i++) {
          (this.form.get('childrenAges') as FormArray).push(new FormControl(this.period.fromDate, [Validators.required]))
        }
      } else {
        for(let i = (this.childrenNum - 1 < 0) ? 0 : this.childrenNum - 1; i < prevFormArraySize; i++) {
          (this.form.get('childrenAges') as FormArray).removeAt(i)
        }
      }
    }
  }

  private setupForm(): void {
    const defaultServiceType = this.serviceTypes.find(st => st.isDefault === 'on');
    this.actualMaxPerson = this.maxPerson;
    this.adultsNum = 0;
    this.childrenNum = 0;

    this.form = new FormGroup({
      fromDate: new FormControl(this.period.fromDate, [Validators.required]),
      nights: new FormControl(1, [Validators.required]),
      serviceType: new FormControl(defaultServiceType ? defaultServiceType.st_name : 0, [Validators.required]),
      adults: new FormControl(this.adultsNum),
      children: new FormControl(this.childrenNum),
      smallPets: new FormControl(0),
      largePets: new FormControl(0),
      parkingSpace: new FormControl(false),
      babyBed: new FormControl(false),
      childrenAges: new FormArray([])
    });
    if (this.categoryModal) {
      this.form.addControl('roomId', new FormControl(this.actualRoomId, [Validators.required]));
    }

    (this.form.get('adults') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.adultsNum = +value;
      this.setActualMaxPerson();
    });
    (this.form.get('children') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.childrenNum = +value;
      this.setChildrenAgeControl();
      this.setActualMaxPerson();
    });

    this.form.valueChanges.pipe(untilDestroyed(this), debounceTime(500)).subscribe(() => {
      this.onChangeTrigger();
    });
  }

  private onChangeTrigger() {
    const rawData: RawRefreshShoppingCartPrices = this.form.getRawValue();
    const data: RefreshShoppingCartPrices = {
      eId: this.categoryModal ? +rawData.roomId : +this.actualRoomId,
      arrivalDate: dayjs(rawData.fromDate).format('YYYY-MM-DD'),
      nightsStay: +rawData.nights,
      adults: +rawData.adults,
      children: +rawData.children,
      birthDates: rawData.childrenAges && rawData.childrenAges.length > 0 ? rawData.childrenAges.map(birth => dayjs(birth).format('YYYY-MM-DD')).join(',') : '',
      smallPets: +rawData.smallPets,
      largePets: +rawData.largePets,
      catering: rawData.serviceType,
      cots: rawData.babyBed ? 1 : 0,
      garages: rawData.parkingSpace ? 1 : 0
    };
    if (this.prevData) {
      if (JSON.stringify(this.prevData) === JSON.stringify(data)) {
        return;
      }
    }
    this.prevData = data;
    this.onChange.emit(data);
  }

  ngOnInit() {
    this.setMinDateForChildren();
    this.setupForm();
    this.setActualMaxPerson();

    this.onChangeDone.subscribe(() => {
      this.setCheckboxVisibilities();
    });
  }

  ngOnDestroy(): void {}

}
