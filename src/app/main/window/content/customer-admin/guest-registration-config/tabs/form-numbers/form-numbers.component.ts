import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { HotelRegistrationRecord } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { LoaderService } from '@/app/shared/loader.service';
import { GuestRegistrationConfigService } from '../../guest-registration-config.service';
import { LoaderType } from '../../loader-types';
import { NumberRange, NumberRanges } from '../../models';

@Component({
  selector: 'app-form-numbers',
  templateUrl: './form-numbers.component.pug',
  styleUrls: ['./form-numbers.component.sass']
})
export class FormNumbersComponent implements OnDestroy {

  enableAddButton = false;
  form: FormArray;
  isLoading: Observable<boolean>;
  maxRegisteredNumber = 0;

  private disableNumberRangeEditing = false;
  private readonly hotelId: HotelRegistrationRecord['id'] | undefined;

  constructor(
    public guestRegistrationConfigService: GuestRegistrationConfigService,
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.FormNumbersLoad);
    const hotel = this.guestRegistrationConfigService.getSelectedHotel();
    this.hotelId = hotel ? hotel.id : undefined;
    this.guestRegistrationConfigService.numberRanges.pipe(
      untilDestroyed(this),
    ).subscribe(numberRanges => this.init(numberRanges));
  }

  private createForm(ranges: NumberRange[], disableNumberRangeEditing: boolean): void {
    this.form = new FormArray(
      ranges.map(range => {
        return new FormGroup({
          id: new FormControl(range.id),
          start: new FormControl(range.start),
          end: new FormControl(range.end),
          enabled: new FormControl(range.enabled),
        });
      })
    );
    if (disableNumberRangeEditing) {
      this.form.disable();
    }
    this.guestRegistrationConfigService.setNumberRangesForm(this.form);
  }

  private init(numberRanges: NumberRanges | null): void {
    if (!numberRanges) {
      this.disableNumberRangeEditing = true;
      this.enableAddButton = false;
      this.maxRegisteredNumber = 0;
      this.guestRegistrationConfigService.loadNumberRanges();
      return;
    }
    this.disableNumberRangeEditing = numberRanges.disableNumberRangeEditing;
    this.enableAddButton = numberRanges.enableAddButton;
    this.maxRegisteredNumber = numberRanges.maxRgNumber;
    const existingForm = this.guestRegistrationConfigService.getNumberRangesForm();
    if (!this.form && existingForm) {
      this.form = existingForm;
    } else {
      this.createForm(numberRanges.ranges, numberRanges.disableNumberRangeEditing);
    }
  }

  ngOnDestroy(): void {}
}
