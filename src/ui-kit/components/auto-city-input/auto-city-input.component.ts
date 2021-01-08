import { ApiILogCalendarService } from '@/app/helpers/api/api-ilog-calendar.service';
import { MainService } from '@/app/main/main.service';
import { Country } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Component, HostBinding, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const availableCountries = ['Austria', 'Germany', 'Netherlands', 'Switzerland'];
const inputDelay = 500;
const loaderType = 'autoCityInput';

@Component({
  selector: 'app-auto-city-input',
  templateUrl: './auto-city-input.component.html',
  styleUrls: ['./auto-city-input.component.sass']
})
export class AutoCityInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() countryControl!: FormControl;
  @Input() postCodeControl!: FormControl;

  @HostBinding('attr.disabled') private isDisabled: 'disabled' | undefined;

  public onChange: Function;
  public onTouched: Function;

  private countryId = new BehaviorSubject<number>(0);
  private postCode = new BehaviorSubject<string>('');

  public cityOptions: string[] = [];
  public cityControl: FormControl;
  public isLoading: Observable<boolean>;

  private countries: Country[] = [];

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private apiILogCalendarService: ApiILogCalendarService,
    private mainService: MainService,
    private loaderService: LoaderService,
  ) {
    ngControl.valueAccessor = this;
    this.isLoading = this.loaderService.isLoading(loaderType);
  }

  public writeValue(value: string): void {
    if (this.cityControl && (this.cityControl as FormControl).value !== value) {
      (this.cityControl as FormControl).setValue(value, {emitEvent: false});
      this.applyCitySelection(value);
    }
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

  public applyCitySelection(city: string): void {
    this.cityOptions = [];
    if (this.ngControl.control) {
      this.ngControl.control.setValue(city);
    }
  }

  @Loading(loaderType)
  private async getCityOptions(countryId: number, postCode: string): Promise<void> {
    const {dbName} = this.mainService.getCompanyDetails();
    this.cityOptions = await this.apiILogCalendarService.getCityFromPostCode(dbName, countryId, postCode).toPromise();
    if (this.cityControl && this.cityControl.value && this.cityOptions.includes(this.cityControl.value)) {
      this.applyCitySelection(this.cityControl.value);
    } else if (this.cityOptions.length === 1) {
      this.applyCitySelection(this.cityOptions[0]);
    }
  }

  private getCountryById(id: Country['c_id']): Country | null {
    if (!this.countries || this.countries.length === 0) {
      const {countryDataProvider} = this.mainService.getCompanyDetails();
      this.countries = countryDataProvider;
    }
    if (!this.countries) {
      return null;
    }
    const country = this.countries.find(c => c.c_id === id);
    return country || null;
  }

  ngOnInit() {
    if (!this.countryControl || !this.postCodeControl) {
      return;
    }
    if (this.ngControl.control) {
      this.cityControl = this.ngControl.control as FormControl;
    }
    this.countryId.next(+this.countryControl.value || 0);
    this.postCode.next(this.postCodeControl.value || '');
    this.countryControl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(countryId => this.countryId.next(+countryId || 0));
    this.postCodeControl.valueChanges.pipe(
      untilDestroyed(this),
      debounceTime(inputDelay)
    ).subscribe(postCode => this.postCode.next(postCode || ''));
    combineLatest([
      this.countryId.pipe(distinctUntilChanged()),
      this.postCode.pipe(distinctUntilChanged())
    ]).subscribe(([countryId, postCode]) => {
      if (!countryId || !postCode) {
        return;
      }
      const country = this.getCountryById(countryId.toString());
      if (!country || !availableCountries.includes(country.c_name.trim())) {
        this.cityOptions = [];
        return;
      }
      this.getCityOptions(countryId, postCode);
    });
  }

  ngOnDestroy(): void {}

}
