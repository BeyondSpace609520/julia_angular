import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { chooseCustomerModal } from '@/app/main/window/shared/customer/choose/modal';
import { Customer } from '@/app/main/window/shared/customer/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { ManageInvoiceService } from '../../manage-invoice.service';
import { LoaderType } from '../loader-types';
import { Invoice, InvoiceRequestData } from '../models';
import { RegformsComponent } from './regforms/regforms.component';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './form.component.pug',
  styleUrls: ['./form.component.sass']
})
export class FormComponent implements OnChanges, OnDestroy {

  @Input() invoice!: Invoice | null;

  @Output() invoiceChange = new EventEmitter<Invoice | null>();
  @Output() valid = new EventEmitter<boolean>();

  form: FormGroup;
  isCompanyType = false;
  protected salutations: FormOption[] = [];
  protected countries: FormOption<number | null>[] = [];
  protected locals: FormOption[] = [];

  constructor(
    private formDataService: FormDataService,
    private invoiceService: ManageInvoiceService,
    private modalService: ModalService,
    private apiClient: ApiClient,
    public loaderService: LoaderService,
  ) { }

  async ngOnChanges({ invoice }: SimpleChanges) {
    if (invoice.previousValue === invoice.currentValue) { return; }

    await this.loadForm(this.invoice);
    this.valid.emit(this.form.valid);
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((values) => {
      this.refreshInvoiceByControlValues(values);
      this.invoiceChange.emit(this.invoice);
      this.valid.emit(this.form.valid);
    });
  }

  ngOnDestroy() {}

  private refreshInvoiceByControlValues(data: any) {
    if (this.invoice) {
      if (data.hasOwnProperty('billNo')) {
        this.invoice.billNo = data.billNo;
      }
      if (data.hasOwnProperty('regNo')) {
        this.invoice.custRegNo = data.regNo;
      }
      if (data.hasOwnProperty('date')) {
       this.invoice.invoiceDate = data.date;
      }
      if (data.hasOwnProperty('fromDate')) {
        this.invoice.fromDate = data.fromDate;
      }
      if (data.hasOwnProperty('untilDate')) {
        this.invoice.untilDate = data.untilDate;
      }
    }
  }

  private async loadForm(data: Invoice | null) {
    const customerValues = this.getCustomerControlValues(data && data.customer);

    this.form = new FormGroup({
      id: new FormControl(customerValues.id, Validators.required),
      salutation: new FormControl(customerValues.salutation, Validators.required),
      title: new FormControl(customerValues.title),
      firstName: new FormControl(customerValues.firstName),
      lastName: new FormControl(customerValues.lastName),
      company: new FormControl(customerValues.company),
      email: new FormControl(customerValues.email),
      address: new FormControl(customerValues.address),
      postCode: new FormControl(customerValues.postCode),
      city: new FormControl(customerValues.city),
      billNo: new FormControl(data && data.billNo),
      regNo: new FormControl(data && data.custRegNo),
      accountNo: new FormControl(customerValues.accountNo),
      taxNo: new FormControl(customerValues.taxNo),
      locale: new FormControl(customerValues.locale),
      country: new FormControl(customerValues.country, Validators.required),
      date: new FormControl(data && data.invoiceDate),
      fromDate: new FormControl(data && data.fromDate),
      untilDate: new FormControl(data && data.untilDate),
      billingText: new FormControl(this.invoice && this.invoice.billingText) // external form control
    });
    this.invoice = data;
    this.locals = this.formDataService.getLocals();
    this.countries = this.formDataService.getCountries();
    this.salutations = this.formDataService.getSalutations(this.form.get('locale') as FormControl);

    if (customerValues.salutation) {
      this.setSalutationEffects(+customerValues.salutation);
    }

    (this.form.get('locale') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.salutations = this.formDataService.normalizeSalutation(
        this.form.get('locale') as FormControl,
        this.form.get('salutation') as FormControl
      );
    });
    (this.form.get('salutation') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe((newSalutationId) => {
      this.setSalutationEffects(+newSalutationId);
    });
  }

  private setSalutationEffects(newSalutationId?: number) {
    if (!newSalutationId) {
      newSalutationId = +(this.form.get('salutation') as FormControl).value;
    }
    this.isCompanyType = newSalutationId === 50;
    (this.form.get('lastName') as FormControl).setValidators(!this.isCompanyType ? [Validators.required, Validators.minLength(3)] : null);
    (this.form.get('company') as FormControl).setValidators(this.isCompanyType ? [Validators.required, Validators.minLength(3)] : null);
    setTimeout(() => {
      (this.form.get('lastName') as FormControl).updateValueAndValidity();
      (this.form.get('company') as FormControl).updateValueAndValidity();
      this.valid.emit(this.form.valid);
    });
  }

  private getCustomerControlValues(customer: Customer | null) {
    return {
      id: customer && customer.id || 0,
      salutation: customer && (customer.salutation || customer.salutationId) || null, // this.formDataService.getDefaultSalutation(),
      title: customer && customer.title || '',
      firstName: customer && customer.firstName || '',
      lastName: customer && customer.lastName || '',
      email: customer && customer.email || '',
      address: customer && customer.address || '',
      postCode: customer && customer.postCode,
      accountNo: customer && customer.accountNo,
      taxNo: customer && customer.taxNo,
      locale: customer && customer.localeId || this.formDataService.getDefaultLocale(),
      country: customer && (customer.countryId || customer.country) || this.formDataService.getDefaultCountry(),
      company: customer && customer.company || '',
      city: customer && customer.city || ''
    };
  }

  public getFieldValue(path: string) {
    return (this.form.get(path) as FormControl).value;
  }

  public resetForm() {
    this.form.reset();
    (this.form.get('locale') as FormControl).setValue(this.formDataService.getDefaultLocale());
    (this.form.get('country') as FormControl).setValue(this.formDataService.getDefaultCountry());
    (this.form.get('salutation') as FormControl).setValue(null);
    this.isCompanyType = false;
    if (this.invoice) {
      this.invoice.customer.id = 0;
    }
  }

  public searchGuest(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      event.preventDefault();
      this.openChooseGuestModal();
    }
  }

  protected async openChooseGuestModal() {
    if (!this.invoice) { throw new Error('Cannot choose customer without defined Invoice'); }
    const previousCustomer = this.getCustomerControlValues(this.form.getRawValue());
    // tslint:disable-next-line: max-line-length
    const customer = await chooseCustomerModal(this.modalService, (this.form.get('lastName') as FormControl).value, this.invoice.customer.id);
    let customerValues = this.getCustomerControlValues(customer);
    if (customer === null) {
      customerValues = previousCustomer;
    }
    Object.keys(customerValues).forEach(key =>
      (this.form.get(key) as FormControl).setValue(customerValues[key])
    );
  }

  protected async openRegForms() {
    if (!this.invoice) { throw new Error('Cannot choose customer without defined Invoice'); }
    if (!this.invoice.bookingId) { throw new Error('bookingId not found'); }

    const modalData = this.modalService.openForms('BackEnd_WikiLanguage.MW_ChooserTitle', RegformsComponent, {
      ngbOptions: {size: 'lg'},
      disableClose: false,
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Insert',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Close',
    });

    await modalData.modalBody.init(this.invoice.bookingId);

    modalData.modal.save.subscribe(async () => {
      if (!modalData.modalBody.selected) { return; }
      const selectedRegNo = modalData.modalBody.selected.rg_number;

      (this.form.get('regNo') as FormControl).setValue(this.combineRegNo((this.form.get('regNo') as FormControl).value, selectedRegNo));
      modalData.modalBody.removeSelected();
    });
  }

  combineRegNo(previous: string | null, added: string) {
    const previousRegNos = previous ? previous.split('; ') : [];
    const newRegNos = Array.from(new Set(previousRegNos.concat(added)));

    return newRegNos.join('; ');
  }

  getExternalField(id: string) {
    return this.form.get(id);
  }

  getRequestData(): InvoiceRequestData {
    const { billNo, regNo, billingText, date, fromDate, untilDate, ...customer } = this.form.getRawValue();

    return {
      billNo,
      regNo,
      billingText,
      date,
      fromDate,
      untilDate,
      customer
    };
  }

  @Loading(LoaderType.MANAGE_INVOICE)
  async save() {
    const id = this.invoice ? this.invoice.billingId : 0;
    await this.apiClient.saveInvoice(id, this.getRequestData(), this.invoiceService.forceEdit).toPromise();
  }
}
