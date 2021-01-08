import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderType } from '../../loader-types';
import { Enquiry } from '../../models';

@Component({
  selector: 'app-rejection-modal',
  templateUrl: './rejection-modal.component.pug',
  styleUrls: ['./rejection-modal.component.sass']
})
export class RejectionModalComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    reason: new FormControl('', Validators.required),
    message: new FormControl(),
  });
  onChange: (valid) => void;

  reasons = [
    { name: 'BackEnd_WikiLanguage.generic_ChooseOne', value: '', placeholder: true },
    { name: 'BackEnd_WikiLanguage.epAirbnbDecReason1', value: 'dates_not_available' },
    { name: 'BackEnd_WikiLanguage.epAirbnbDecReason2', value: 'not_a_good_fit' },
    { name: 'BackEnd_WikiLanguage.epAirbnbDecReason3', value: 'waiting_for_better_reservation' },
    { name: 'BackEnd_WikiLanguage.epAirbnbDecReason4', value: 'not_comfortable' },
  ];

  constructor(private apiClient: ApiClient) { }

  init(onChange: (valid) => void) {
    this.onChange = onChange;
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => onChange(this.form.valid));
  }

  @Loading(LoaderType.ACTION)
  async onSend(enquiry: Enquiry) {
    const { value: reason } = this.form.get('reason') as FormControl;
    const { value: message } = this.form.get('message') as FormControl;

    await this.apiClient.sendEnquiryToAirbnb(enquiry.id, true, reason, message).toPromise();
    return true;
  }

  ngOnInit() {
    this.onChange(this.form.valid);
  }

  ngOnDestroy() {}
}
