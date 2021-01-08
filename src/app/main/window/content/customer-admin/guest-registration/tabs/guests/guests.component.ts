import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { ApiRegistrationFormService } from '@/app/helpers/api/api-registration-form.service';
import { MainService } from '@/app/main/main.service';
import { ViewService } from '@/app/main/view/view.service';
import { Providers } from '@/app/main/window/content/customer-admin/create-registration-form/consts';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { FormErrorService } from '../../../../../shared/services/form-error.service';
import { buildUrl, redirectWithPOST } from '../../../../../utils';
import { GuestInformationProps, openGuestInformation, ValidationLevel } from '../../../guest-information/utils';
import { downloadAsCSV } from '../../exporters/csv';
import { downloadAsExcel } from '../../exporters/xls';
import { LoaderType } from '../../loader-types';
import { GuestRegistrationFormDetail, GuestRegistrationItem, HotelRegistrationRecord, TableField, ViewMode } from '../../models';
import { canForceDeparture } from '../../reduce';
import { SearchData, Tab } from '../tab';
import { getExportedFileName, openRegForm } from '../utils';

@Component({
  selector: 'app-guests-tab',
  templateUrl: './guests.component.pug',
  styleUrls: ['./guests.component.sass']
})
export class GuestsComponent extends Tab implements OnChanges {

  @Input() mode!: ViewMode;
  @Input() hotel!: HotelRegistrationRecord;
  @Input() top: boolean;

  public fields: TableField<GuestRegistrationFormDetail>[] = [];
  public items: GuestRegistrationFormDetail[];
  public selectedItems: GuestRegistrationFormDetail[] = [];

  private searchData?: SearchData; // cache search data to reload items

  constructor(
    public loaderService: LoaderService,
    private apiClient: ApiClient,
    private apiRegistrationFormService: ApiRegistrationFormService,
    private mainService: MainService,
    private modalService: ModalService,
    private translate: TranslateService,
    private formErrorService: FormErrorService,
    private viewService: ViewService,
  ) {
    super();
  }

  public async exportCSV(): Promise<void> {
    const fields = await this.getExportFields();
    const fileName = await getExportedFileName(this.mode, this.translate);
    downloadAsCSV(fields, this.items, fileName); // TODO sorted items
  }

  public async exportExcel(): Promise<void> {
    const fields = await this.getExportFields();
    const fileName = await getExportedFileName(this.mode, this.translate);
    downloadAsExcel(fields, this.items, fileName); // TODO sorted items
  }

  @Loading(LoaderType.LOAD)
  public async search(data: SearchData) {
    this.searchData = data;
    this.items = await this.apiClient.getRegistrationForms(data, this.mode).toPromise();
    this.selectedItems = [];
  }

  @Loading(LoaderType.LOAD)
  public async printAll(): Promise<void> {
    const items = (this.selectedItems && this.selectedItems.length > 0) ? this.selectedItems : this.items;
    const response = await this.apiClient.getPrintLink(this.hotel, items, this.mode).toPromise();

    redirectWithPOST(response.url, response.postParams || {});
  }

  public selectItems(items: GuestRegistrationFormDetail[]): void {
    this.selectedItems = items;
  }

  @HostListener('document:keydown', ['$event'])
  public async handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.top) {
      return;
    }
    const ctrlDPressed = event.ctrlKey && event.code === 'KeyD';
    const anyItemSelected = this.selectedItems.length > 0;

    if (ctrlDPressed && anyItemSelected && this.mode === ViewMode.ARRIVED) {
      event.preventDefault();
      const message = await this.translate.get('BackEnd_WikiLanguage.MW_ConfirmDepartedMessage').toPromise();
      const modalContent = `${message}\n${this.selectedItems.map(item => item.number)}`;
      const confirmed = await this.modalService.openConfirm('BackEnd_WikiLanguage.MW_AreYouSure', modalContent);

      if (confirmed) {
        await this.apiClient.markDeparted(this.selectedItems).toPromise();
        this.refresh();
      }
    }
  }

  public isArrivalDepartureOnSameDay(item: GuestRegistrationFormDetail): boolean {
    return !!item.untilDate && item.untilDate.getTime() === item.fromDate.getTime();
  }

  public openRegForm(item: GuestRegistrationFormDetail): void {
    openRegForm(this.viewService, this.hotel, item.bookingId, item.id);
  }

  @Loading(LoaderType.LOAD)
  public async print(item: GuestRegistrationFormDetail): Promise<void> {
    const response = await this.apiClient.getPrintLink(this.hotel, item, this.mode).toPromise();

    redirectWithPOST(response.url, response.postParams || {});
  }

  @Loading(LoaderType.LOAD)
  public async printGuestCard(item: GuestRegistrationFormDetail): Promise<void> {
    try {
      const url = await this.getGuestCardPrintLink(item);
      window.open(url, '_blank');
    } catch (e) {
      this.modalService.openSimpleText('', e.message);
    }
  }

  public printGuestCardPerPerson(item: GuestRegistrationFormDetail): void {
    try {
      const url = this.getGuestCardPrintPerPersonLink(item);
      window.open(url, '_blank');
    } catch (e) {
      this.modalService.openSimpleText('', e.message);
    }
  }

  public async validateGuests(item: GuestRegistrationFormDetail): Promise<boolean> {
    const resp = await this.apiClient.validateGuestsForRgId(item).toPromise();

    if (!resp.valid) {
      const props: GuestInformationProps = {
        hotel: this.hotel,
        bookingId: resp.bookingId,
        preselectGuestId: resp.guestId,
        baseValidation: ValidationLevel.Full, // TODO we need STRICT validation for non-main guests
      };

      openGuestInformation(this.viewService, props);
      this.modalService.openSimpleText('', 'BackEnd_WikiLanguage.MW_guestDataNotComplete_error');
    }
    return resp.valid;
  }

  public async openErrorModal(
    error: {code: string, text: string},
    isDeparture?: boolean,
    item?: GuestRegistrationFormDetail
  ): Promise<boolean> {
    return await this.formErrorService.showDepartedError(
      error.code,
      error.text,
      item ? item.id : null,
      isDeparture && item &&
      (
        // This condition in short: Is it (Feratel and errorcode in 15, 52, 53 or 99.3) OR (Wilken and errorcode in 141, 4)?
        (['15', '52', '53', '99.3'].includes(error.code) &&
          [Providers.FERATEL, Providers.FERATELCH].includes(this.hotel.guestRegistrationProviderId))
        ||
        (this.hotel.guestRegistrationProviderId === Providers.WILKEN && ['141', '4'].includes(error.code))
      )
      ? canForceDeparture(this.hotel.guestRegistrationProviderId, item.id) : false
    );
  }

  @Loading(LoaderType.LOAD)
  public async setArrival(item: GuestRegistrationFormDetail): Promise<void> {
    if (!await this.validateGuests(item)) { return; }
    try { // TODO
      await this.apiClient.setArrival(item).toPromise();
      this.refresh();
    } catch (e) {
      this.openErrorModal(e);
    }
  }

  @Loading(LoaderType.LOAD)
  public async setDeparted(item: GuestRegistrationFormDetail): Promise<void> {
    if (!await this.validateGuests(item)) { return; }
    try { // TODO
      await this.apiClient.setDeparture(item).toPromise();
      this.refresh();
    } catch (e) {
      this.openErrorModal(e, true, item);
    }
  }

  @Loading(LoaderType.LOAD)
  public async cancel(item: GuestRegistrationFormDetail): Promise<void> {
    if (!await this.validateGuests(item)) { return; }
    try { // TODO
      await this.apiClient.cancelRegform(item).toPromise();
      this.refresh();
    } catch (e) {
      if (await this.openErrorModal(e)) {
        this.refresh();
      }
    }
  }

  @Loading(LoaderType.LOAD)
  public async delete(item: GuestRegistrationFormDetail): Promise<void> {
    await this.apiClient.deleteRegform(item).toPromise();
    this.refresh();
  }

  private async getExportFields(): Promise<{[key in keyof GuestRegistrationItem]?: string}> {
    const translations = await this.translate.get(this.fields.map(field => field.label)).toPromise();
    return this.fields.reduce((fieldTranslations, field) => {
      fieldTranslations[field.name] = translations[field.label];
      return fieldTranslations;
    }, {});
  }

  private async getGuestCardPrintLink(item: GuestRegistrationFormDetail): Promise<string> {
    const { desklineEditionV3, guestCardSeparate, guestRegistrationProviderId } = this.hotel;

    if (guestRegistrationProviderId === Providers.WILKEN) {
      return await this.apiRegistrationFormService.getWilkenCardPrintLink(+item.id).toPromise();
    }

    if (desklineEditionV3) {
      return this.getGuestCardPrintLinkForDesklineV3(+item.number, false);
    }

    if (guestCardSeparate) {
      return this.getGuestCardPrintLinkIfSeparated(+item.number, false);
    }

    return this.getGuestCardPrintLinkNonSeparated(+item.number);
  }

  private getGuestCardPrintPerPersonLink(item: GuestRegistrationFormDetail): string {
    const { desklineEditionV3 } = this.hotel;
    if (desklineEditionV3) {
      return this.getGuestCardPrintLinkForDesklineV3(+item.number, true);
    }
    return this.getGuestCardPrintLinkIfSeparated(+item.number, true);
  }

  private getGuestCardPrintLinkForDesklineV3(formNumber: GuestRegistrationFormDetail['id'], perPerson: boolean): string {
    if (!this.hotel.guestCardPrintLink) {
      throw new Error('Print link not found');
    }
    const parameters: {[key: string]: string | number | null} = {
      oestat: this.hotel.communityNumber,
      betriebnr: this.hotel.businessIndicator,
      companyCode: this.hotel.companyCode,
      sheetnumber: formNumber,
    };
    if (this.hotel.guestCardSeparate && formNumber > 0) {
      parameters.printMainGuestOnly = perPerson ? 'false' : 'true';
    }
    return buildUrl(this.hotel.guestCardPrintLink, parameters);
  }

  private getGuestCardPrintLinkIfSeparated(formNumber: number, perPerson: boolean): string {
    const parameters: {[key: string]: string | number | null} = {
      mcnummer: this.hotel.mcNumber,
      username: this.hotel.username,
      password: this.hotel.password,
      mblattnr: formNumber,
      typ: 'GAESTEKARTE'
    };
    if (perPerson && +formNumber > 0) {
      parameters.aufteilen = 'true';
    }
    return buildUrl('https://meldeclient.feratel.at/meldeclient/MCLInterfaceServlet/print', parameters);
  }

  private getGuestCardPrintLinkNonSeparated(formNumber: number): string {
    const parameters: {[key: string]: string | number | null} = {
      mandantcode: this.hotel.clientCode,
      username: this.hotel.username,
      password: this.hotel.password,
      autologin: 'true',
    };
    if (+formNumber > 0) {
      parameters.filter_msnr = formNumber;
    }
    return buildUrl(`https://card.feratel.com/ccard${this.hotel.code}/jsp/login.jsp`, parameters);
  }

  private refresh(): void {
    if (this.searchData) {
      this.search(this.searchData);
    }
  }

  ngOnChanges({ mode }: SimpleChanges) {
    if (mode && mode.currentValue !== mode.previousValue) {
      this.fields = getFields(mode.currentValue);
      const current = new Date();
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(current.getDate() - 15);

      if (this.mode === ViewMode.DEPARTED) {
        this.tabLoad.emit({ from: twoWeeksAgo, until: current });
      } else {
        this.tabLoad.emit({ from: null, until: null });
      }
    }
  }
}

const allFields: TableField<GuestRegistrationFormDetail>[] = [
  { name: 'number', label: 'BackEnd_WikiLanguage.MW_RegFormNumberShort'},
  { name: 'lastName', label: 'BackEnd_WikiLanguage.MW_LastName'},
  { name: 'customerAddress', label: 'BackEnd_WikiLanguage.MW_Address'},
  { name: 'customerCountry', label: 'BackEnd_WikiLanguage.MW_Country'},
  { name: 'customerNationality', label: 'BackEnd_WikiLanguage.MW_State'},
  { name: 'fromDate', label: 'BackEnd_WikiLanguage.MW_Arrival', type: 'date'},
  { name: 'plannedUntilDate', label: 'BackEnd_WikiLanguage.MW_PlannedDeparture', type: 'date'},
  { name: 'untilDate', label: 'BackEnd_WikiLanguage.MW_Departure', type: 'date'},
  { name: 'cancelled', label: 'BackEnd_WikiLanguage.MW_Cancellation'},
  { name: 'noOfPersons', label: 'BackEnd_WikiLanguage.MW_CountOfPersons'},
  { name: 'adultNO', label: 'BackEnd_WikiLanguage.MW_AdultCount'},
  { name: 'childNO', label: 'BackEnd_WikiLanguage.MW_ChildCount'},
  { name: 'type', label: 'BackEnd_WikiLanguage.MW_RegFormType'},
];

function getFields(mode: ViewMode): TableField<GuestRegistrationFormDetail>[] {
  return allFields.filter(field => {
    switch (field.name) {
      case 'customerCountry':
      case 'customerNationality':
      case 'adultNO':
      case 'childNO':
        return mode === ViewMode.DEPARTED;
      case 'noOfPersons':
        return mode !== ViewMode.DEPARTED;
      default:
        return true;
    }
  });
}
