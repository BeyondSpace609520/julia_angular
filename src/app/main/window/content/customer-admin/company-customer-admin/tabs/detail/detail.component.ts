import { MainService } from '@/app/main/main.service';
import { Component, EventEmitter, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { subYears } from 'date-fns';

import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { ViewService } from '@/app/main/view/view.service';
import { chooseCustomerModal } from '@/app/main/window/shared/customer/choose/modal';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { UpdateCustomer } from '../../events';
import { LoaderType } from '../../loader-types';
import { CustomerDetail } from '../../models';
import { getDefaultDetail, inverseCustomerDetail, reduceCustomerDetail } from '../../reduce';
import { TabComponent } from '../tab';
import { openMergeGuestModal } from './merge-guest/modal';
import { SendProvisionComponent } from './send-provision/send-provision.component';

@Component({
  selector: '' +
    'app-detail',
  templateUrl: './detail.component.pug',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent extends TabComponent implements OnChanges, OnDestroy {

  @Output() update = new EventEmitter<number>();

  public form: FormGroup;
  public detail: CustomerDetail;
  public salutations: FormOption[] = [];
  public countries: FormOption<number | null>[] = [];
  public locals: FormOption[] = [];
  public minBirthdayDate: Date;
  public cityControl: FormControl;

  constructor(
    private modalService: ModalService,
    private apiClient: ApiClient,
    public loaderService: LoaderService,
    public formDataService: FormDataService,
    private eventBus: EventBusService,
    private viewService: ViewService,
    public mainSerivice: MainService
  ) {
    super();
    this.eventBus.on<UpdateCustomer>('updateCustomer').pipe(untilDestroyed(this)).subscribe(() => {
      this.loadForm();
      this.update.emit(this.item.id);
    });
    this.minBirthdayDate = subYears(new Date(), 100);
  }

  @Loading(LoaderType.TAB)
  async loadForm() {
    const detail = !this.item || !this.item.id
      ? getDefaultDetail(this.formDataService)
      : reduceCustomerDetail(await this.apiClient.getCompanyCustomerDetail(this.item.id).toPromise());
    this.detail = detail;
    this.form = new FormGroup({
      salutation: new FormControl(detail.salutation, [Validators.required]),
      title: new FormControl(detail.title),
      firstName: new FormControl(detail.firstName),
      lastName: new FormControl(detail.lastName),
      email: new FormControl(detail.email),
      email2: new FormControl(detail.email2),
      channelEmail: new FormControl(detail.channelEmail),
      phoneNo: new FormControl(detail.phoneNo),
      phoneNo2: new FormControl(detail.phoneNo2),
      address: new FormControl(detail.address),
      postCode: new FormControl(detail.postCode),
      city: new FormControl(detail.city),
      country: new FormControl(detail.country, [Validators.required]),
      locale: new FormControl(detail.locale, [Validators.required]),
      birthday: new FormControl(detail.birthday),
      identNo: new FormControl(detail.identNo),
      taxNumber: new FormControl(detail.taxNumber),
      internalInformation: new FormControl(detail.internalInformation),
      sendNewsletter: new FormControl(detail.sendNewsletter),
      sendSafeEmail: new FormControl(detail.sendSafeEmail),
      sendThankyouEmail: new FormControl(detail.sendThankyouEmail),
      sendPaymentsEmail: new FormControl(detail.sendPaymentsEmail),
      sendRegionalEvents: new FormControl(detail.sendRegionalEvents),
      allowAutoAnonymization: new FormControl(detail.allowAutoAnonymization),
    });

    this.locals = this.formDataService.getLocals();
    this.countries = this.formDataService.getCountries();
    this.salutations = this.formDataService.getSalutations(this.form.get('locale') as FormControl);

    (this.form.get('locale') as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      // tslint:disable-next-line: max-line-length
      this.salutations = this.formDataService.normalizeSalutation(this.form.get('locale') as FormControl, this.form.get('salutation') as FormControl);
    });

    this.cityControl = (this.form.get('city') as FormControl);
  }


  ngOnChanges({ item }: SimpleChanges) {
    if (item && item.currentValue !== item.previousValue) {
      this.loadForm();
    }
  }

  ngOnDestroy(): void {
  }

  async openProvision() {
    const modalData = this.modalService.openForms('BackEnd_WikiLanguage.dsgvoInformationMailSubject', SendProvisionComponent, {
      primaryButtonLabel: 'general.send.text',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_dontSend',
      disableClose: true
    });

    modalData.modalBody.init(this.detail.email, valid => {
      modalData.modal.formStatus = valid;
    });

    modalData.modal.save.subscribe(async () => {
      if (this.detail.id) {
        modalData.modal.formStatus = false;
        await modalData.modalBody.save({c_id: this.detail.id});
        modalData.modal.close(true);
      }
    });
  }

  @Loading(LoaderType.TAB)
  async openMoreInformation() {
    const customer = await this.apiClient.getBookingGuest(this.item.id).toPromise();

    this.viewService.openViewWithProperties(
      'consumerMoreInformation',
      {customer}
    );
  }

  @Loading(LoaderType.TAB)
  async onSubmit() {
    if ((this.form.get('locale') as FormControl).value !== this.detail.locale) {
      if (!await this.confirmLangSubmit()) { return; }
    }
    const body = inverseCustomerDetail({ ...this.detail, ...this.form.value });
    const id = !this.item || !this.item.id
      ? await this.apiClient.createCompanyCustomer(body).toPromise()
      : await this.apiClient.saveCompanyCustomerDetail(body).toPromise();
    // await this.loadForm();
    this.update.emit(+id); // https://trello.com/c/P0NfwF2z/32-customeradmin-screen-detail-tab-save-button
  }

  async confirmLangSubmit() {
    const modalResponse = await this.modalService.openConfirm('BackEnd_WikiLanguage.guestLanguageChangeAlert', '', {
      primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Yes',
      secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
      disableClose: true
    });

    return modalResponse;
  }

  async openMergeGuestProfile() {
    const modalData = await openMergeGuestModal(this.modalService);
    const customer = await chooseCustomerModal(this.modalService, '', this.item.id);

    if (customer) {
      await modalData.modalBody.loadCustomerMergeProfiles(this.item.id, customer.id);
      modalData.modal.save.subscribe(async () => {
        await modalData.modalBody.save(this.item.id, customer.id);
        modalData.modal.close(true);
        this.update.emit();
        this.loadForm();
      });
    } else {
      modalData.modal.close(true);
    }
  }
}
