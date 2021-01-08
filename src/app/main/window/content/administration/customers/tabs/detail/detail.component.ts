import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import { MainService } from '@/app/main/main.service';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { CustomerItem, CustomerItemDetails } from '../../models';
import { additionalFields, bottomFields, contactFields, Fields, getMainFields, Resources } from './fields';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.pug',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit, OnChanges {

  @Input() id!: CustomerItem['id'];

  details: CustomerItemDetails;

  mainFields: Fields[] = getMainFields(
    () => window.open(`mailto:${this.details.email}`),
    () => window.open(`//${this.details.webUrl}`, 'blank')
  );
  contactFields: Fields = contactFields;
  bottomFields: Fields = bottomFields;
  additionalFields: Fields = additionalFields;

  selectResources: {[key in Resources]: FormOption<string | number | null>[]} = {
    salutations: [],
    hotels: [],
    resellers: [],
    statuses: [],
    locations: [],
    seasons: [],
    categories: []
  };
  form: FormGroup;

  constructor(
    private apiClient: ApiClient,
    private cacheService: CacheService,
    public loaderService: LoaderService,
    private formData: FormDataService,
    private translate: TranslateService,
    private mainService: MainService,
    private modal: ModalService
  ) {
  }


  @Loading(LoaderType.TAB)
  async ngOnInit() {
    const [hotels, resellers, statuses] = await Promise.all(
      [
        this.cacheService.getHotelSoftwareList(),
        this.cacheService.getResellerList(),
        this.cacheService.getCustomerStatusOptions()
      ]
    );

    this.selectResources = {
      salutations: await this.cacheService.getCentralSalutationList(),
      hotels,
      resellers,
      statuses,
      locations: [
        { value: 'city', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_LocationCity').toPromise() },
        { value: 'hotel', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_LocationHoliday').toPromise() }
      ],
      seasons: [
        { value: '01', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_Season01').toPromise() },
        { value: '02', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_Season02').toPromise() },
        { value: 'wholeYear', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_SeasonWholeYear').toPromise() }
      ],
      categories: [
        { value: 'private', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_CategoryPrivateRoom').toPromise() },
        { value: 'BnB', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_CategoryBnB').toPromise() },
        { value: 'hotel', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_CategoryHotel').toPromise() },
        { value: 'inn', name: await this.translate.get('BackEnd_WikiLanguage.RCAD_CategoryInn').toPromise() },
      ]
    };
  }

  @Loading(LoaderType.TAB)
  async ngOnChanges({ id }: SimpleChanges) {
    const allFields = [...this.mainFields[0], ...this.mainFields[1], ...additionalFields, ...contactFields, ...bottomFields];

    if (id && id.currentValue !== id.previousValue) {
      this.details = await this.apiClient.getCustomerDetails(this.id).toPromise();
      this.form = new FormGroup(allFields.reduce((acc, [type, label, property]) => {
        return {
          ...acc,
          [property]: new FormControl({ value: this.details[property], disabled: true })
        };
      }, {}));
    }
  }

  @Loading(LoaderType.TAB)
  async rebuildCache() {
    const db = this.mainService.getCompanyDetails().dbName;

    await this.apiClient.clearCache(db).toPromise();
    this.modal.openSimpleText('Cache rebuilt successfully');
  }
}
