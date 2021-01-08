import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { CacheService } from '@/app/helpers/cache.service';
import { LoaderService } from '@/app/shared/loader.service';
import { GuestDetail, GuestType } from '../../../guest-information/models';
import { GuestRegistrationForm } from '../../../guest-registration/models';
import { ChooseGuestComponent } from '../../choose-guest/choose-guest.component';
import { CreateRegistrationFormService } from '../../create-registration-form.service';
import { IndividualGuestsData, RegistrationGuestTypes } from '../../models';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.pug',
  styleUrls: ['./individual.component.sass']
})
export class IndividualComponent implements OnInit, OnChanges {

  @Input() guests: GuestDetail[];
  @Input() canCreateNewGuest!: number;
  @Input() arrived!: boolean;
  @Input() forGroup!: boolean;
  @Output() delete = new EventEmitter<GuestDetail>();
  @Output() add = new EventEmitter<GuestDetail>();
  @Output() save = new EventEmitter<IndividualGuestsData>();

  public mainGuest?: GuestDetail;
  public selectedItem: GuestDetail | null = null;

  private allGuestTypes: RegistrationGuestTypes;

  get registrationForm(): GuestRegistrationForm | undefined {
    return this.regFormService.registrationForm;
  }

  constructor(
    private cacheService: CacheService,
    public loaderService: LoaderService,
    private modal: ModalService,
    private regFormService: CreateRegistrationFormService
  ) {}

  public changeGuestType(guestTypeId: number): void {
    if (this.isMainGuestType(guestTypeId)) {
      this.setNewMainGuest(this.selectedItem);
    } else if (this.selectedItem) {
      this.selectedItem.guestTypeId = guestTypeId;
    }
  }

  public newGuest(): void {
    const modalData = this.modal.openForms('BackEnd_WikiLanguage.MW_AddGuestTitle', ChooseGuestComponent, {
      primaryButtonLabel: 'BackEnd_WikiLanguage.MW_AddGuestToMeldeschein'
    });

    modalData.modalBody.addedGuests = this.guests;
    modalData.modal.save.subscribe(() => {
      modalData.modalBody.selectedGuests.forEach(guest => {
        this.add.emit(guest);
      });
      modalData.modal.close(true);
    });
  }

  public onSave(): void {
    this.save.emit({ main: this.mainGuest, all: this.guests });
  }

  public selectItem(guest: GuestDetail | null): void {
    this.selectedItem = guest;
  }

  private detectMainGuest(): void {
    this.mainGuest = this.guests.find(g => this.isMainGuestType(g.guestTypeId));
    if (!this.mainGuest) {
      this.setDefaultMainGuest();
    }
  }

  private getGuestById(guestId: number): GuestDetail | undefined {
    return this.guests.find(guest => guest.id === guestId);
  }

  private init(): void {
    this.detectMainGuest();
    this.updateSelectedItem();
  }

  private isMainGuestType(guestTypeId: number | null): boolean {
    if (guestTypeId === null) {
      return false;
    }
    if (this.forGroup) {
      return guestTypeId === +this.allGuestTypes.tourGuide.value;
    } else {
      return guestTypeId === +this.allGuestTypes.main.value;
    }
  }

  private resetGuestType(guestId: number): void {
    const guest = this.guests.find(g => g.id === guestId);
    if (!guest) {
      return;
    }
    if (this.forGroup) {
      guest.guestTypeId = +this.allGuestTypes.groupGuest.value;
    } else {
      guest.guestTypeId = +(guest.type === GuestType.CHILD ? this.allGuestTypes.child.value : this.allGuestTypes.adult.value);
    }
  }

  private setDefaultMainGuest(): void {
    const newMainGuest = this.guests.find(g => g.type === GuestType.ADULT) || this.guests.find(g => g.type === GuestType.CHILD);
    if (newMainGuest) {
      this.setNewMainGuest(newMainGuest);
    }
  }

  private setNewMainGuest(guest: GuestDetail | null): void {
    if (guest && this.mainGuest && this.mainGuest.id === guest.id) {
      return;
    }
    if (this.mainGuest) {
      this.resetGuestType(this.mainGuest.id);
    }
    this.mainGuest = guest || undefined;
    if (this.mainGuest) {
      this.mainGuest.guestTypeId = this.forGroup ? +this.allGuestTypes.tourGuide.value : +this.allGuestTypes.main.value;
    }
  }

  private updateSelectedItem() {
    const selectedItem = this.selectedItem ? this.getGuestById(this.selectedItem.id) : undefined;
    if (selectedItem) {
      this.selectItem(selectedItem);
    } else {
      if (this.guests && this.guests.length > 0) {
        this.selectItem(this.guests[0]);
      } else {
        this.selectItem(null);
      }
    }
  }

  async ngOnInit(): Promise<void> {
    this.allGuestTypes = await this.cacheService.getGuestTypes();
    this.init();
  }

  ngOnChanges({guests}: SimpleChanges): void {
    if (guests && this.allGuestTypes) {
      this.init();
    }
  }
}
