import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { GuestDetail } from '../../guest-information/models';
import { CreateRegistrationFormService } from '../create-registration-form.service';

enum LoaderType {
  MODAL = 'load-modal'
}
type Item = FormOption<boolean | number> & { guest: GuestDetail };

@Component({
  selector: 'app-choose-guest',
  templateUrl: './choose-guest.component.pug',
  styleUrls: ['./choose-guest.component.sass']
})
export class ChooseGuestComponent implements OnInit {

  @Input() leaderGuest?: GuestDetail;
  @Input() addedGuests?: GuestDetail[];
  @Input() multiple = true;

  public selectedItem: Item['value'];
  public guestItems: Item[] = [];
  public isLoading: Observable<boolean>;

  get selectedGuests(): GuestDetail[] {
    return this.guestItems.filter(item => this.multiple ? item.value : this.selectedItem === item.value).map(item => item.guest);
  }

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    public regFormService: CreateRegistrationFormService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MODAL);
  }

  @Loading(LoaderType.MODAL)
  async load() {
    const { bookingId, hotel } = this.regFormService;
    const guests = await this.apiClient.getBookingGuests(bookingId, false, null, hotel.id).toPromise();

    this.guestItems = guests.map(guest => ({ value: this.multiple ? false : guest.id, name: guest.displayField, guest }));
    this.selectedItem = this.guestItems[0].value;
  }

  // TODO replace getter function with pipe or static variable
  isLeader(guest: GuestDetail): boolean {
    return !!this.leaderGuest && this.leaderGuest.id === guest.id;
  }

  // TODO replace getter function with pipe or static variable
  isAlreadyAdded(guest: GuestDetail) {
    return this.addedGuests && this.addedGuests.some(g => g.id === guest.id);
  }

  @Loading(LoaderType.MODAL)
  public async addGuest(isAdult: boolean): Promise<void> {
    await this.apiClient.addGuestToBooking(this.regFormService.bookingId, isAdult).toPromise();
    this.load();
  }

  @Loading(LoaderType.MODAL)
  public async deleteManuallyAddedPerson(guest: GuestDetail): Promise<void> {
    if (!guest.manuallyAdded) {
      return;
    }
    await this.apiClient.deleteManuallyAddedPerson(guest.guestId).toPromise();
    this.load();
  }

  ngOnInit(): void {
    this.load();
  }
}
