import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { LanguageService } from '@/app/i18n/language.service';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { calculateRangeMinAndMax, subscribeToFormStateChange } from '@/app/main/window/shared/forms/utils';
import { FormState } from '@/app/shared/forms/models';
import { LoaderService } from '@/app/shared/loader.service';
import { DiscountDetail } from '../models';

const minNights = 1;
const maxNights = 365;

@Component({
  selector: 'app-discount-details',
  templateUrl: './details.component.pug',
  styleUrls: ['./details.component.sass']
})
export class DiscountDetailsComponent implements OnChanges, OnDestroy {
  private formState = new BehaviorSubject<FormState>({
    valid: true,
    dirty: false,
    touched: false
  });

  @Input() data!: DiscountDetail;
  @Input() extraFields = true;
  @Output() localeChange = new EventEmitter<number>();
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

  public locals: FormOption[];
  public localeId = new FormControl(null);
  public form: FormGroup;
  public minNightsFrom = minNights;
  public maxNightsFrom = maxNights;
  public minNightsUntil = minNights;
  public maxNightsUntil = maxNights;

  constructor(
    private formDataService: FormDataService,
    private languageService: LanguageService,
    public loaderService: LoaderService
  ) {
    this.locals = this.formDataService.getLocals();
    this.localeId.valueChanges.pipe(untilDestroyed(this)).subscribe(localeId => this.localeChange.emit(localeId));
  }

  public loadForm(item?: DiscountDetail): void {
    this.form = new FormGroup({
      designation: new FormControl(item ? item.designation : ''),
      nights: new FormGroup({
        from: new FormControl(item ? item.nights.from : 0),
        until: new FormControl(item ? item.nights.until : 0)
      }),
      discountType: new FormControl(item ? item.discountType : 'PricePerPersonPerNight'),
      discount: new FormControl(item ? item.discount : 0)
    });
    this.localeId.setValue(String(this.languageService.getLanguageId()), { emitEvent: false });
    this.form.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      setTimeout(() => {
        const {maxRangeStart, minRangeEnd} = calculateRangeMinAndMax(this.form.get('nights.from'), this.form.get('nights.until'));
        if (maxRangeStart !== undefined) {
          this.maxNightsFrom = maxRangeStart;
        }
        if (minRangeEnd !== undefined) {
          this.minNightsUntil = minRangeEnd;
        }
      });
    });

    subscribeToFormStateChange(this, this.form, this.formState);
  }

  public setDesignation(value: string): void {
    (this.form.get('designation') as FormControl).setValue(value);
  }

  public extractForm(): DiscountDetail {
    return {
      localeId: this.localeId.value,
      ...this.form.getRawValue()
    };
  }

  ngOnChanges({ data }: SimpleChanges): void {
    if (data && data.currentValue !== data.previousValue) {
      this.loadForm(data.currentValue);
    }
  }

  ngOnDestroy(): void {}
}
