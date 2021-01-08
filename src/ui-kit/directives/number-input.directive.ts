import { LanguageService } from '@/app/i18n/language.service';
import {
  Directive,
  ElementRef, HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy, OnInit, Output, Self,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormatService } from '../services/format.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

const defaultDecimals = 2;

@Directive({
  selector: 'input[type=text][appNumberInput]'
})
export class NumberInputDirective implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  private validChangeSubject = new BehaviorSubject<boolean>(true);

  @Input() min: number | string;
  @Input() max: number | string;
  @Input() decimals: number | string = defaultDecimals;
  @Input() autoFixErrors: boolean;
  @Input() required: 'required' | undefined;
  @Output() validChange: Observable<boolean> = this.validChangeSubject.pipe(untilDestroyed(this), distinctUntilChanged());
  @HostBinding('attr.disabled') private isDisabled: 'disabled' | undefined;
  @HostBinding('attr.inputmode') private inputMode: string;

  public get valid(): boolean {
    return this.validChangeSubject.getValue();
  }

  public onChange: Function;
  public onTouched: Function;

  private languageInitialized = false;

  @HostListener('keydown', ['$event']) onDown(e: KeyboardEvent) {
    const allowed = /[0-9-]/.test(e.key)
      || e.ctrlKey
      || ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
      || (e.key === this.formatService.decimalSeparator && this.el.nativeElement.value.indexOf(this.formatService.decimalSeparator) === -1 && +this.decimals > 0);

    if (!allowed) {
      e.preventDefault();
    }
  }

  @HostListener('keyup') onUp() {
    this.calculateModelValue();
  }

  @HostListener('change') onInputChange() {
    this.calculateModelValue();
  }

  @HostListener('blur') onBlur() {
    if (this.onTouched) {
      this.onTouched(true);
    }
    if (this.ngControl) {
      this.formatViewValue(this.ngControl.value);
    }
  }

  constructor(
    @Self() private ngControl: NgControl,
    private el: ElementRef,
    private formatService: FormatService,
    private languageService: LanguageService,
  ) {
    ngControl.valueAccessor = this;
  }

  public writeValue(value: number): void {
    this.formatViewValue(value);
  }

  public registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled ? 'disabled' : undefined;
  }

  private clamp(num: number): number {
    if (!this.autoFixErrors) {
      return num;
    }
    if (Number.isFinite(+this.min) && num < +this.min) {
      return +this.min;
    } else if (Number.isFinite(+this.max) && num > +this.max) {
      return +this.max;
    } else {
      return num;
    }
  }

  private calculateModelValue(): void {
    if (this.el.nativeElement.value === '' || this.el.nativeElement.value === null) {
      if (this.required === undefined || this.required === null || !this.autoFixErrors) {
        this.onChange(null);
      } else {
        this.onChange(Math.max(0, +this.min));
      }
    } else {
      const num = this.formatService.formattedNumberValue(this.el.nativeElement.value);
      this.onChange(this.roundToDecimals(this.clamp(num || 0)));
    }
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.updateValueAndValidity();
    }
  }

  private checkDecimalsType(): void {
    if (typeof this.decimals === 'string') {
      if (this.decimals === '') {
        this.decimals = defaultDecimals;
      } else {
        this.decimals = +this.decimals;
      }
    }
  }

  private formatViewValue(newValue: number): void {
    if (newValue === undefined || newValue === null) {
      this.updateView('');
    } else {
      const formatted = this.formatService.numberFormat(newValue, +this.decimals);
      this.updateView(formatted);
    }
  }

  private roundToDecimals(value: number): number {
    return Math.round(value * Math.pow(10, +this.decimals)) / Math.pow(10, +this.decimals);
  }

  private updateValidators(): void {
    if (!this.ngControl) {
      return;
    }
    const validators: ValidatorFn[] = [];
    if (this.required !== undefined && this.required !== null) {
      validators.push(Validators.required);
    }
    if (Number.isFinite(+this.min)) {
      validators.push(Validators.min(+this.min));
    }
    if (Number.isFinite(+this.max)) {
      validators.push(Validators.max(+this.max));
    }
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValidators(Validators.compose(validators));
      this.ngControl.control.updateValueAndValidity();
    }
  }

  private updateView(value: string | null): void {
    this.el.nativeElement.value = value;
  }

  ngOnInit(): void {
    this.updateValidators();
    this.inputMode = 'numeric';
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.statusChanges.pipe(
        untilDestroyed(this),
        distinctUntilChanged()
      ).subscribe(status => this.validChangeSubject.next(status === 'VALID'));
    }
    setTimeout(() => {
      this.languageService.languageId$.pipe(
        untilDestroyed(this),
        distinctUntilChanged()
      ).subscribe(() => {
        if (!this.languageInitialized) {
          this.languageInitialized = true;
        } else {
          this.calculateModelValue();
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (document.activeElement !== this.el.nativeElement) { // when input is not focused
      this.onBlur();
    }
    if (changes.decimals) {
      this.checkDecimalsType();
      this.updateValidators();
    }
    if (changes.min || changes.max) {
      this.updateValidators();
    }
  }

  ngOnDestroy(): void {
    this.validChangeSubject.next(true);
  }
}
