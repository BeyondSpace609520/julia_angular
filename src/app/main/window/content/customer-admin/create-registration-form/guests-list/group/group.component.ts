import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { CacheService } from '@/app/helpers/cache.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { GuestDetail } from '../../../guest-information/models';
import { ChooseGuestComponent } from '../../choose-guest/choose-guest.component';
import { Providers } from '../../consts';
import { CreateRegistrationFormService } from '../../create-registration-form.service';
import { LoaderType } from '../../loader-types';
import {
  GroupGuest,
  GroupGuestCounty,
  RegistrationFormGroup,
  RegistrationFormGuests,
  RegistrationGuestTypes,
  RegistrationTaxType
} from '../../models';

enum ItemID {
  LEADER = 'leader',
  GUEST = 'guest'
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.pug',
  styleUrls: ['./group.component.sass']
})
export class GroupComponent implements OnChanges {

  @Input() group: RegistrationFormGuests['group'];
  @Input() arrived!: boolean;
  @Output() save = new EventEmitter<RegistrationFormGroup>();

  guests: GroupGuest[] = [];
  taxTypes: RegistrationTaxType[];
  countries: GroupGuestCounty[];
  selectedItemId: ItemID | null = null;
  isAVSProvider = false;

  list = [
    { id: ItemID.LEADER, name: 'BackEnd_WikiLanguage.MW_TourLeader' },
    { id: ItemID.GUEST, name: 'BackEnd_WikiLanguage.MW_TourGroupGuests' }
  ];

  private allGuestTypes: RegistrationGuestTypes;
  public Providers: Providers;

  constructor(
    private cacheService: CacheService,
    public loaderService: LoaderService,
    private modal: ModalService,
    public regFormService: CreateRegistrationFormService
  ) {
    if (this.regFormService.hotel.guestRegistrationProviderId === Providers.AVS) {
      this.isAVSProvider = true;
    }
  }

  public selectItem(id: ItemID): void {
    this.selectedItemId = id;
  }

  public addGuest(): void {
    // const leader = this.group.leader;
    // // https://trello.com/c/3ZAPTi6r/192-customer-admin-guest-registration-create-registration-form-v-travel-group
    // // Mechanics
    // const leaderCountry = leader
    //   ? (
    //     (leader.postCode ? this.countries.find(c =>
    //       c.countryId === leader.countryId && leader.postCode >= c.postCode.from && leader.postCode < c.postCode.until
    //     ) : null)
    //     || (!leader.postCode ? this.countries.find(c => c.countryId === leader.countryId) : null)
    //   ) : null;

    this.guests.push({
      id: null,
      count: null,
      // will be set in setCountryValue
      // countryId: leaderCountry ? leaderCountry.value : (this.countries[0] ? this.countries[0].value : null),
      countryId: null,
      taxTypeId: this.taxTypes[this.taxTypes.length - 1].id,
      registrationFormCountryExternalId: null,
      registrationFormId: this.regFormService.registrationForm ? this.regFormService.registrationForm.id : null
    });
  }

  public setCountryValue(): void {
    const leader = this.group.leader;
    // https://trello.com/c/3ZAPTi6r/192-customer-admin-guest-registration-create-registration-form-v-travel-group
    // Mechanics
    const leaderCountry = leader
      ? (leader.postCode
          ? this.countries.find(
              (c) =>
                c.countryId === leader.countryId &&
                leader.postCode >= c.postCode.from &&
                leader.postCode < c.postCode.until
            )
          : null) ||
        (!leader.postCode
          ? this.countries.find((c) => c.countryId === leader.countryId)
          : null)
      : null;

    if (leaderCountry) {
      for (const guest of this.guests) {
        // set country based on leaders country and postcode
        guest.countryId = leaderCountry.value;
        // set count to 0
        guest.count = null;
      }
      // for (let i = 0; i < this.guests.length; i++) {
      //   // set country based on leaders country and postcode
      //   this.guests[i].countryId = leaderCountry.value;
      //   // set count to 0
      //   this.guests[i].count = null;
      // }
    }
  }

  public clear(guest: GroupGuest): void {
    guest.count = null;
  }

  public changeLeader(currentLeader: GuestDetail): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.MW_ChangeTourleader', ChooseGuestComponent);

    modalData.modalBody.leaderGuest = currentLeader;
    modalData.modalBody.multiple = false;
    modalData.modal.save.subscribe(() => {
      const [newLeader] = modalData.modalBody.selectedGuests;
      newLeader.guestTypeId = this.allGuestTypes.tourGuide.value;
      this.group.leader = newLeader;
      modalData.modal.close(true);
    });
  }

  public onSave(): void {
    this.save.emit(this.group);
  }

  @Loading(LoaderType.LOAD)
  async ngOnChanges({ group }: SimpleChanges): Promise<void> {
    this.allGuestTypes = await this.cacheService.getGuestTypes();

    if (group.currentValue && group.currentValue.leader) {
      group.currentValue.leader.guestTypeId = +this.allGuestTypes.tourGuide.value;
    }

    if (!this.taxTypes || !this.countries) {
      [this.taxTypes, this.countries] = await Promise.all([
        this.cacheService.getRegistrationTaxTypes(this.regFormService.hotel.id, true),
        this.cacheService.getCountriesForGuestGroups(this.regFormService.hotel.id)
      ]);
    }

    // TODO - combine group.guests and countries
    // need to adapt the country id which is used in the country dropdown
    // based on zip code
    if (group && group.currentValue !== group.previousValue) {
      this.guests = [... this.group.guests];

      // why add additonal 6 guests??
      for (let i = this.guests.length; i < 6; i++) {
        this.addGuest();
      }
      this.setCountryValue();
    }
  }
}
