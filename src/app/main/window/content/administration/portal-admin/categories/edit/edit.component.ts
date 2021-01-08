import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { PortalAdminCategory, PortalAdminCategoryTranslation } from '../../models';

const LOAD = 'load-category-detail';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit.component.pug',
  styleUrls: ['./edit.component.sass']
})
export class EditCategoryComponent implements OnChanges {

  @Input() category?: PortalAdminCategory;
  @Output() update = new EventEmitter();

  public form: FormGroup;
  public languages: FormOption[];

  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private formData: FormDataService
  ) {
    this.isLoading = this.loaderService.isLoading(LOAD);
    this.languages = this.formData.getLocals();
  }

  @Loading(LOAD)
  async save(): Promise<void> {
    const form = this.form.getRawValue();
    const translations: PortalAdminCategoryTranslation[] = (form.translations as string[]).map((name, i) => ({
      localeId: this.languages[i].value,
      name
    }));

    await this.apiClient.savePortalCategory(this.category ? this.category.id : null, form.identifier, translations).toPromise();
    this.update.emit();
  }

  @Loading(LOAD)
  private async initForm(): Promise<void> {
    const translations = this.category ? await this.apiClient.getPortalCategoryTranslations(this.category.id).toPromise() : [];

    this.form = new FormGroup({
      identifier: new FormControl(this.category ? this.category.identifier : '', Validators.required),
      translations: new FormArray(this.languages.map(item => {
        const translation = translations.find(t => item.value === t.localeId);

        return new FormControl(translation ? translation.name : '', Validators.required);
      }))
    });
  }

  ngOnChanges({ category }: SimpleChanges): void {
    if (category && category.currentValue !== category.previousValue) {
      this.initForm();
    }
  }
}
