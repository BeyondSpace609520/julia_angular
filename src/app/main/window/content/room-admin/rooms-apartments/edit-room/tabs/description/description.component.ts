import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../../loader-type';
import { ApartmentDescription, RoomListItem } from '../../../models';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.pug',
  styleUrls: ['./description.component.sass']
})
export class DescriptionComponent extends TabComponent implements OnInit {

  form: FormArray;
  locals: FormOption[];

  constructor(
    public loaderService: LoaderService,
    private formData: FormDataService,
    private apiClient: ApiClient
  ) {
    super();
  }

  async ngOnInit() {
    this.locals = this.formData.getLocals();
  }

  @Loading(LoaderType.TAB)
  async init(item: RoomListItem) {
    const descriptions = await this.apiClient.getApartmentDescriptions(item.id).toPromise();

    this.form = new FormArray(this.locals.map(l => {
      const targetDescription = descriptions.find(d => +d.localeId === +l.value);

      return new FormControl(targetDescription ? targetDescription.description : '');
    }));
  }

  @Loading(LoaderType.TAB)
  async save() {
    const body: ApartmentDescription[] = this.form.controls.map((c, i) => ({
      localeId: +this.locals[i].value,
      description: String(c.value)
    }));

    await this.apiClient.saveApartmentDescriptions(this.item.id, body).toPromise();
    this.edited.emit();
  }
}
