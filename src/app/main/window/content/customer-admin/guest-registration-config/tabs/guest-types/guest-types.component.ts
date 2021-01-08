import { Component, EventEmitter, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { RegistrationTaxType } from '@/app/main/window/content/customer-admin/create-registration-form/models';
import { HotelRegistrationRecord } from '@/app/main/window/content/customer-admin/guest-registration/models';
import { LoaderService } from '@/app/shared/loader.service';
import { GuestRegistrationConfigService } from '../../guest-registration-config.service';
import { LoaderType } from '../../loader-types';
import { ReportingClientProvider } from '../../models';


@Component({
  selector: 'app-guest-types',
  templateUrl: './guest-types.component.pug',
  styleUrls: ['./guest-types.component.sass']
})
export class GuestTypesComponent implements OnDestroy {

  form: GuestTypeValues;
  guestTypes: RegistrationTaxType[];
  isLoading: Observable<boolean>;
  selectedGuestTypeId: RegistrationTaxType['globalId'] | null;
  selectedProviderId: ReportingClientProvider['id'];

  private readonly hotelId: HotelRegistrationRecord['id'] | undefined;
  private readonly providerId: ReportingClientProvider['id'] | undefined;

  constructor(
    public guestRegistrationConfigService: GuestRegistrationConfigService,
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.GuestTypesLoad);
    const hotel = this.guestRegistrationConfigService.getSelectedHotel();
    this.hotelId = hotel ? hotel.id : undefined;
    const provider = this.guestRegistrationConfigService.getSelectedProvider();
    this.providerId = provider ? provider.id : undefined;
    this.guestRegistrationConfigService.guestTypes.pipe(
      untilDestroyed(this),
    ).subscribe(guestTypes => this.init(guestTypes));
  }

  setGuestTypeUsed(used: boolean): void {
    this.guestTypes = this.guestTypes.map(guestType => {
      if (guestType.globalId === this.selectedGuestTypeId) {
        guestType.usedByHotel = used;
      }
      return guestType;
    });
    this.form.selectedIds = this.getSelectedIds();
    this.form.dirty = true;
    this.form.changed.emit();
  }

  private createForm(): void {
    this.form = {
      dirty: false,
      selectedIds: this.getSelectedIds(),
      changed: new EventEmitter()
    };
    this.guestRegistrationConfigService.setGuestTypeForm(this.form);
  }

  private getSelectedIds(): number[] {
    return this.guestTypes.filter(guestType => guestType.usedByHotel).map(guestType => guestType.globalId);
  }

  private init(guestTypes: RegistrationTaxType[] | null): void {
    if (!guestTypes) {
      this.guestRegistrationConfigService.loadGuestTypes();
      return;
    }
    this.guestTypes = guestTypes;
    const existingForm = this.guestRegistrationConfigService.getGuestTypeForm();
    if (!this.form && existingForm) {
      this.form = existingForm;
    } else {
      this.createForm();
    }
  }

  ngOnDestroy(): void {}

}

export interface GuestTypeValues {
  dirty: boolean;
  selectedIds: number[];
  changed: EventEmitter<void>;
}
