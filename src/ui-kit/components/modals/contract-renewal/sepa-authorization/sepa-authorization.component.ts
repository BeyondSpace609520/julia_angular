import { MainService } from '@/app/main/main.service';
import { Country } from '@/app/main/models';
import { SEPAFormData } from '@/ui-kit/components/modals/contract-renewal/models';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

const creditorId = 'AT88ZZZ00000001941';

@Component({
  selector: 'app-sepa-authorization',
  templateUrl: './sepa-authorization.component.html',
  styleUrls: ['./sepa-authorization.component.sass']
})
export class SepaAuthorizationComponent implements OnInit, OnChanges, OnDestroy {

  @Input() formData: Partial<SEPAFormData> = {};
  @Output() formDataChange = new EventEmitter<Partial<SEPAFormData>>();
  @Input() errorMessage?: string;
  @Output() formStateChange = new EventEmitter<boolean>();

  form: FormGroup;
  creditorId = creditorId;
  countries: Country[];

  constructor(
    private mainService: MainService
  ) {}

  private init(): void {
    const {countryDataProvider} = this.mainService.getCompanyDetails();
    this.countries = countryDataProvider;
    this.setupForm();
  }

  private setupForm(): void {
    if (!this.formData) {
      this.formData = {};
    }
    this.form = new FormGroup({
      accountHolder: new FormControl(this.formData.accountHolder || '', [Validators.required]),
      iban: new FormControl(this.formData.iban || '', [Validators.required]),
      postCode: new FormControl(this.formData.postCode || '', [Validators.required]),
      city: new FormControl(this.formData.city || '', [Validators.required]),
      address: new FormControl(this.formData.address || '', [Validators.required]),
      country: new FormControl(this.formData.country || null, [Validators.required])
    });

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(values => {
      this.formData = values;
      this.formDataChange.emit(this.formData);
      this.formStateChange.emit(this.form.valid);
    })
  }

  private setIbanInvalid(): void {
    const ibanControl = this.form.get('iban');
    if (!ibanControl) {
      return;
    }
    ibanControl.setErrors({invalid: true});
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges({errorMessage}: SimpleChanges): void {
    if (errorMessage && errorMessage.currentValue && errorMessage.currentValue !== '') {
      this.setIbanInvalid();
    }
  }

  ngOnDestroy(): void {}
}
