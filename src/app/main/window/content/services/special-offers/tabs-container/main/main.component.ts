import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthService } from '@/app/auth/auth.service';
import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { ServiceType } from '@/app/main/window/shared/pricing-settings/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { environment } from '@/environments/environment';
import { SendToRoomplanEvent } from '../../../../calendar/calendar-html/events';
import { LoaderType } from '../../loader-types';
import { SpecialOffer, SpecialOfferDetails } from '../../models';

@Component({
  selector: 'app-main-tab',
  templateUrl: './main.component.pug',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit, OnChanges {

  @Input() offer!: SpecialOffer;
  @Output() saved = new EventEmitter();

  details: SpecialOfferDetails;
  form: FormGroup;
  locale = new FormControl(null);

  locals: FormOption[] = [];
  serviceTypes: ServiceType[] = [];
  categories: FormOption<number>[] = [];

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{color: [] }],
      [{align: [] }],
      [{list: 'ordered'}, {list: 'bullet'}]
    ]
  };

  get imageSrc() {
    return this.details.image ? `${environment.mediaUrl}${this.details.image}` : null;
  }

  constructor(
    private formDataService: FormDataService,
    private apiClient: ApiClient,
    private authService: AuthService,
    public loaderService: LoaderService,
    private mainService: MainService,
    private eventBus: EventBusService
  ) {
    this.locals = this.formDataService.getLocals();
    this.locale.setValue(this.authService.getQueryParams().languageId);
    this.locale.valueChanges.subscribe(() => this.loadForm());
  }

  @Loading(LoaderType.LOAD_TAB)
  async ngOnInit() {
    this.serviceTypes = await this.apiClient.getActiveServiceType().toPromise();
    this.categories = await this.apiClient.getSpecialOfferCategories().toPromise();
  }

  async ngOnChanges({ offer }: SimpleChanges) {
    if (offer && offer.currentValue !== offer.previousValue) {
      this.loadForm();
    }
  }

  @Loading(LoaderType.LOAD_TAB)
  async loadForm() {
    this.details = await this.apiClient.getSpecialOfferDetails(this.offer.id, this.locale.value).toPromise();
    this.form = new FormGroup({
      title: new FormControl(this.details.title),
      shortDesc: new FormControl(this.details.shortDesc),
      longDesc: new FormControl(this.details.longDesc),
      sortOrder: new FormControl(this.details.sortOrder),
      active: new FormControl(this.details.active),
      image: new FormControl(this.details.image),
      serviceTypeId: new FormControl(this.details.serviceTypeId),
      categoryId: new FormControl(this.details.categoryId),
      highlighted: new FormControl(this.details.highlighted),
    });
  }

  @Loading(LoaderType.LOAD_TAB)
  async uploadImage() {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');
    const { dbName } = this.mainService.getCompanyDetails();

    if (file) {
      await this.apiClient.uploadSpecialOfferImage(this.offer.id, file, dbName).toPromise();
      this.loadForm();
    }
  }

  @Loading(LoaderType.LOAD_TAB)
  async clearImage() {
    await this.apiClient.deleteSpecialOfferImage(this.offer).toPromise();
    this.loadForm();
  }

  @Loading(LoaderType.LOAD_TAB)
  async save() {
    const { title, shortDesc, longDesc, sortOrder, active, image, serviceTypeId, categoryId, highlighted } = this.form.getRawValue();
    const details: SpecialOfferDetails = {
      ...this.offer,
      title, shortDesc, longDesc, sortOrder, active, image, serviceTypeId, categoryId, highlighted
    };

    await this.apiClient.editSpecialOfferDetails(details, this.locale.value).toPromise();

    this.notifyRoomplan();
    this.loadForm();
    this.saved.emit();
  }

  notifyRoomplan() { // TODO c&p
    this.eventBus.emit<SendToRoomplanEvent>('sendToRoomplan', { method: 'specialOfferAdminChanged', object: { status: 'ok' }});
  }
}
