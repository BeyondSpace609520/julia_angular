import { Component, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-type';
import { RoomCategory } from '../../models';
import { TabComponent } from '../tab.component';

@Component({
  selector: 'app-category-details',
  templateUrl: './details.component.pug',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent extends TabComponent implements OnChanges {

  @Output() saved = new EventEmitter<RoomCategory>();

  form: FormGroup;
  locals: FormOption[] = [];

  constructor(
    private formDataService: FormDataService,
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) {
    super();
    this.locals = this.formDataService.getLocals();
  }

  loadForm() {
    this.form = new FormGroup({
      systemText: new FormControl(this.category.name),
      sortOrder: new FormControl(this.category.sortOrder),
      langs: new FormArray(this.locals.map(({ value: id }) => {
        // tslint:disable-next-line: triple-equals
        const localeEntity = this.category.locals.find(l => l.localeId == id);

        if (!localeEntity) { throw new Error('Locale entity not found'); }

        const { title, description, priceInfo } = localeEntity;

        return new FormGroup({
          title: new FormControl(title, [Validators.required]),
          description: new FormControl(description),
          priceInfo: new FormControl(priceInfo),
        });
      }))
    });
  }

  ngOnChanges({ category }: SimpleChanges) {
    if (category.currentValue !== category.previousValue) {
      this.loadForm();
    }
  }

  @Loading(LoaderType.SAVE_CATEGORY)
  async save() {
    const category: RoomCategory = {
      id: this.category.id,
      name: (this.form.get('systemText') as FormControl).value,
      sortOrder: (this.form.get('sortOrder') as FormControl).value,
      locals: this.locals.map((l, i) => {
        const control = (this.form.get('langs') as FormArray).controls[i];

        return {
          title: (control.get('title') as FormControl).value,
          description: (control.get('description') as FormControl).value,
          priceInfo: (control.get('priceInfo') as FormControl).value,
          localeId: l.value,
          localeEntryId: this.category.locals[i].localeEntryId
        };
      }),
      raw: this.category.raw
    };
    await this.apiClient.saveCategory(category).toPromise();
    this.saved.emit(category);
  }
}
