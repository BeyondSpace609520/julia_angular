import { RecommendationVoucher, RecommendationFormData } from '@/ui-kit/components/modals/contract-renewal/models';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.sass']
})
export class SuccessPageComponent implements OnInit, OnDestroy {

  @Input() formData: Partial<RecommendationFormData> = {};
  @Output() formDataChange = new EventEmitter<Partial<RecommendationFormData>>();
  @Output() formStateChange = new EventEmitter<boolean>();

  readonly vouchers: RecommendationVoucher[] = [
    {
      id: 'amazon',
      label: 'BackEnd_WikiLanguage.CRF_RecommendationRewardAmazon'
    },
    {
      id: 'shell',
      label: 'BackEnd_WikiLanguage.CRF_RecommendationRewardShell'
    },
    {
      id: 'hm',
      label: 'BackEnd_WikiLanguage.CRF_RecommendationRewardHM'
    }
  ];

  form: FormGroup;
  selectedVoucher?: RecommendationVoucher;

  constructor() { }

  private init(): void {
    this.setupForm();
  }

  private setupForm(): void {
    const voucherControl = new FormControl(this.formData.voucher || null, [Validators.required]);

    this.form = new FormGroup({
      company: new FormControl(this.formData.company || '', [Validators.required]),
      city: new FormControl(this.formData.city || '', [Validators.required]),
      contact: new FormControl(this.formData.contact || '', [Validators.required]),
      voucher: voucherControl
    });
    this.formStateChange.emit(this.form.valid);
    voucherControl.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      this.selectedVoucher = this.vouchers.find(voucher => voucher.id === value);
    });
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(values => {
      this.formData = values;
      this.formDataChange.emit(this.formData);
      this.formStateChange.emit(this.form.valid);
    });
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy(): void {}

}
