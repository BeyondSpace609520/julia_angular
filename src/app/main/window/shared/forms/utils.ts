import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable, UnaryFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { FormState } from '@/app/shared/forms/models';
import { DateRange } from '@/ui-kit/models';

export function normalizeDateRange(fromDate: AbstractControl, untilDate: AbstractControl, pipe: UnaryFunction<any, any>) {
    const from: Observable<Date> = fromDate.valueChanges;
    const until: Observable<Date> = untilDate.valueChanges;
    const isInvalidRange = () => {
      if (!(fromDate.value instanceof Date)) { return false; }
      if (!(untilDate.value instanceof Date)) { return false; }

      return fromDate.value.getTime() > untilDate.value.getTime();
    };

    from.pipe(filter(isInvalidRange), pipe).subscribe(() => untilDate.setValue(new Date(fromDate.value)));
    until.pipe(filter(isInvalidRange), pipe).subscribe(() => fromDate.setValue(new Date(untilDate.value)));
}

export function isDateRangeValid(range: DateRange): boolean {
  if (!range.start || isNaN(range.start.getTime())) {
    return false;
  }
  if (!range.end || isNaN(range.end.getTime())) {
    return false;
  }
  return true;
}

export function conditionalRequired(change: Observable<any>) {
  let control: FormControl;
  let required: boolean;

  change.subscribe(r => {
    required = r;
    if (control) { control.updateValueAndValidity(); }
  });

  return (formControl: FormControl): ValidationErrors | null => {
    control = formControl;
    return required ? Validators.required(formControl) : null;
  };
}

export function checkAllCheckboxes(allControl: FormControl, items: FormArray) {
  allControl.valueChanges.subscribe(arrival => {
    items.controls.forEach(control => control.setValue(arrival, { emitEvent: false }));
  });
  items.valueChanges.subscribe((args: boolean[]) => {
    allControl.setValue(args.every(checked => checked), { emitEvent: false });
  });
}

export function normalizeInterval(minControl: AbstractControl, maxControl: AbstractControl) {
  minControl.valueChanges.subscribe(min => +min > +maxControl.value && maxControl.setValue(min, { emitEvent: false }));
  maxControl.valueChanges.subscribe(max => +max < +minControl.value && minControl.setValue(max, { emitEvent: false }));
}

export function calculateRangeMinAndMax(
  rangeStartControl: AbstractControl | null,
  rangeEndControl: AbstractControl | null,
): {maxRangeStart?: number, minRangeEnd?: number} {
  return {
    maxRangeStart: rangeEndControl ? rangeEndControl.value : undefined,
    minRangeEnd: rangeStartControl ? rangeStartControl.value : undefined
  };
}

export function subscribeToFormStateChange<T>(
  parent: T,
  form: FormGroup,
  formState: BehaviorSubject<FormState>,
) {
  form.statusChanges.pipe(
    untilDestroyed(parent)
  ).subscribe(() => {
    formState.next({
      valid: form.valid,
      dirty: form.dirty,
      touched: form.touched
    });
  });
}
