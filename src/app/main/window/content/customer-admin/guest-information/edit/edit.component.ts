import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { CopyToSection } from '@/app/main/window/shared/copy-to/copy-to.component';
import { openCopyToModal } from '@/app/main/window/shared/copy-to/modal';
import { Fields } from '@/app/main/window/shared/customer/form/fields';
import { CustomerFormComponent } from '@/app/main/window/shared/customer/form/form.component';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { HotelRegistrationRecord } from '../../guest-registration/models';
import { LoaderType } from '../loader-types';
import { GuestDetail } from '../models';
import { ValidationLevel } from '../utils';
import copyToFields from './copy-to-fields';

@Component({
  selector: 'app-edit-guest',
  templateUrl: './edit.component.pug',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnChanges {

  @Input() guest!: GuestDetail;
  @Input() others!: GuestDetail[];
  @Input() hotel?: HotelRegistrationRecord;
  @Input() baseValidationLevel: ValidationLevel | undefined;
  @Input() mainGuestId: GuestDetail['id'] | undefined;
  @Output() cancel = new EventEmitter();
  @Output() updated = new EventEmitter();

  @ViewChild('customerForm', { static: true }) customerForm: CustomerFormComponent<GuestDetail>;

  public validationLevel: ValidationLevel | undefined;
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private modal: ModalService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.SAVE_ITEM);
  }

  public modifyColumns(columns: Fields<GuestDetail>[], consestTooltip: any): void {
    columns[2].splice(6, 0, ['select', 'MW_SettingVisitReason', 'arrivalTypeId', { resource: 'arrivalTypes' }]);
    columns[2].splice(8, 0, ['select', 'MW_SettingReason', 'travelPurposeId', { resource: 'travelPurposes' }]);

    if (this.hotel && (this.guest.guestCardPrintingEnabled || this.hotel.hasGuestCard)) {
      columns[0].push(['checkbox', 'MW_guestCardPrintingConsent', 'guestCardPrintingEnabled', {
        tooltip: consestTooltip,
        icon: 'information'
      }]);
    }
  }

  @Loading(LoaderType.SAVE_ITEM)
  public async save(): Promise<void> {
    const guestDetail = this.customerForm.extract();

    await this.apiClient.saveBookingGuestDetail(guestDetail).toPromise();
    this.updated.emit();
  }

  public openCopyTo(): void {
    const modal = openCopyToModal(this.modal, () => this.updated.emit());
    const sections: CopyToSection[] = [
      {
        label: 'BackEnd_WikiLanguage.MW_CopyToData',
        items: copyToFields
      },
      {
        label: 'BackEnd_WikiLanguage.MW_CopyToPersons',
        items: this.others.map(item => ({ id: item.guestId, label: item.displayField }))
      }
    ];
    modal.init({ description: 'BackEnd_WikiLanguage.MW_CopyToDescription' }, sections, async ([information, persons]) => {
      await this.apiClient.copyGuestTo(this.guest.guestId, information, persons).toPromise();
      this.updated.emit();
    });
  }

  public isDirty(): boolean {
    return this.customerForm.form.dirty;
  }

  private determineRequiredFields(guest: GuestDetail, baseValidationLevel?: ValidationLevel, mainGuestId?: GuestDetail['id']): void {
    this.validationLevel = this.getValidationLevel(guest, baseValidationLevel, mainGuestId);
  }

  private getValidationLevel(guest: GuestDetail, baseValidationLevel?: ValidationLevel, mainGuestId?: GuestDetail['id']): ValidationLevel | undefined {
    if (!this.baseValidationLevel) {
      return undefined;
    }
    if (mainGuestId && guest.id === mainGuestId) {
      return ValidationLevel.Full;
    }
    return baseValidationLevel;
  }

  ngOnChanges({guest, baseValidationLevel, mainGuestId}: SimpleChanges): void {
    if (guest || baseValidationLevel || mainGuestId) {
      this.determineRequiredFields(
        guest ? guest.currentValue : this.guest,
        baseValidationLevel ? baseValidationLevel.currentValue : this.baseValidationLevel,
        mainGuestId ? mainGuestId.currentValue : this.mainGuestId
      );
    }
  }
}
