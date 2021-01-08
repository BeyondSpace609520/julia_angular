import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { CacheService } from '@/app/helpers/cache.service';
import { FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { GuestDetail, GuestType } from '../../guest-information/models';
import { CreateRegistrationFormService } from '../create-registration-form.service';
import { LoaderType } from '../loader-types';
import { RegistrationGuestTypes, RegistrationTaxType } from '../models';

@Component({
  selector: 'app-edit-guest',
  templateUrl: './edit-guest.component.pug',
  styleUrls: ['./edit-guest.component.sass']
})
export class EditGuestComponent implements OnInit, OnChanges, OnDestroy {
  @Input() guest!: GuestDetail;
  @Input() canEdit!: boolean;
  @Input() arrived!: boolean;
  @Input() isGroupGuest!: boolean;
  @Input() mainGuestId?: GuestDetail['id'];
  @Output() changeGuestType = new EventEmitter<number>();

  public taxTypes: RegistrationTaxType[] = [];
  public allGuestTypes: RegistrationGuestTypes;
  public availableGuestTypes: FormOption<number>[] = [];

  private initialized = new BehaviorSubject<boolean>(false);

  constructor(
    private cacheService: CacheService,
    public loaderService: LoaderService,
    public regFormService: CreateRegistrationFormService
  ) { }

  public onChangeGuestType(guestTypeId: number): void {
    this.changeGuestType.emit(guestTypeId);
  }

  public editInformation(guest: GuestDetail): void {
    this.regFormService.editGuestInformation(guest, this.arrived, this.mainGuestId, this.onGuestEdited.bind(this));
  }

  private onGuestEdited(guest: GuestDetail): void {
    if (guest && guest.id === this.guest.id) {
      this.guest = guest;
    }
  }

  private async setAvailableGuestTypes(): Promise<void> {
    await this.isInitialized();
    const types: FormOption<number>[] = [];
    if (this.isGroupGuest) {
      types.push(this.allGuestTypes.tourGuide);
      if (this.guest.id !== this.mainGuestId) {
        types.push(this.allGuestTypes.groupGuest);
      }
    } else {
      types.push(this.allGuestTypes.main);
      if (this.guest.id !== this.mainGuestId) {
        types.push(this.guest.type === GuestType.ADULT ? this.allGuestTypes.adult : this.allGuestTypes.child);
      }
    }
    this.availableGuestTypes = types;
  }

  private async isInitialized(): Promise<void> {
    if (this.initialized.getValue()) {
      return;
    }
    return new Promise(resolve => {
      this.initialized.pipe(
        untilDestroyed(this),
        takeWhile(initialized => !initialized, true)
      ).subscribe(initialized => {
        if (initialized) {
          resolve();
        }
      });
    });
  }

  @Loading(LoaderType.LOAD)
  async ngOnInit(): Promise<void> {
    [this.allGuestTypes, this.taxTypes] = await Promise.all([
      this.cacheService.getGuestTypes(),
      this.cacheService.getRegistrationTaxTypes(this.regFormService.hotel.id, true)
    ]);
    this.initialized.next(true);
  }

  ngOnChanges({guest, mainGuestId}: SimpleChanges): void {
    if (guest || mainGuestId) {
      this.setAvailableGuestTypes();
    }
  }

  ngOnDestroy(): void {}
}
