import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { ApiClient } from '@/app/helpers/api-client';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';
import { Customer } from '@/app/main/window/shared/customer/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../../loader-types';
import fields, { Fields, Resources } from './fields';

@Component({
  selector: 'app-merge-guest',
  templateUrl: './merge-guest.component.pug',
  styleUrls: ['./merge-guest.component.sass']
})
export class MergeGuestComponent implements OnDestroy {

  public form: FormGroup;
  public profiles: { id: string, label: string }[] = [];
  public fields: Fields = fields;
  public selectedResources: {[key in Resources]: FormOption<string | number | null>[]} = {
    salutations: [],
    countries: [],
    documentTypes: [],
    interests: [],
    nationality: []
  };
  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService,
    private formData: FormDataService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.MERGE_GUEST);
  }

  @Loading(LoaderType.MERGE_GUEST)
  public async init(onChange: (valid: boolean) => void): Promise<void> {
    this.loadForm();
    this.form.valueChanges.pipe(startWith(null)).subscribe(s => onChange(this.form.valid));

    const data = await this.formData.getCustomerFormResources();
    const salutations = this.formData.getSalutations();
    const countries = this.formData.getCountries();

    this.selectedResources = {
      salutations,
      countries,
      documentTypes: data.documentTypes,
      interests: data.characteristics,
      nationality: countries
    };
  }

  @Loading(LoaderType.MERGE_GUEST)
  public async loadCustomerMergeProfiles(id1: number, id2: number): Promise<void> {
    const [A, B] = await this.apiClient.getMergeGuestCustomersDetail(id1, id2).toPromise();

    this.setProfile('A', A);
    this.setProfile('B', B);
  }

  @Loading(LoaderType.MERGE_GUEST)
  public async save(id1: number, id2: number): Promise<void> {
    const [customer1, customer2] = this.getCustomers(id1, id2);
    const [mainCustomer, otherCustomer] = (this.form.get('mainGuest') as FormControl).value === 'A'
      ? [customer1, customer2]
      : [customer2, customer1]
    ;

    await this.apiClient.mergeGuestProfiles(mainCustomer, otherCustomer).toPromise();
  }

  private loadForm(): void {
    this.profiles = [
      { id: 'A', label: 'BackEnd_WikiLanguage.CCA_MergeGuestsHeaderLeft' },
      { id: 'B', label: 'BackEnd_WikiLanguage.CCA_MergeGuestsHeaderRight' }
    ];
    const profileA = new FormArray(fields.map(([type, label, property]) => new FormControl()));
    const profileB = new FormArray(fields.map(([type, label, property]) => new FormControl()));

    this.form = new FormGroup({
      mainGuest: new FormControl(null, [Validators.required]),
      profiles: new FormGroup({
        A: profileA,
        B: profileB
      })
    });
    this.trackFieldsHighlight(profileA, profileB);
  }

  private trackFieldsHighlight(profileA: FormArray, profileB: FormArray): void {
    fields.forEach((field, index) => {
      const options: Fields[0][3] = field[3] || (field[3] = {});
      const controlA = profileA.at(index);
      const controlB = profileB.at(index);

      combineLatest(controlA.valueChanges, controlB.valueChanges).pipe(untilDestroyed(this)).subscribe(([a, b]) => {
        options.highlight = a !== b;
      });
    });
  }

  private setProfile(id: string, c: Customer): void {
    const profile = (this.form.get('profiles') as FormControl).get(id) as FormArray;

    fields.forEach(([_, __, property], i) => {
      profile.controls[i].setValue(c[property]);
    });
  }

  private getCustomers(id1: number, id2: number): [Customer, Customer] {
    const getCustomerData = (id: Customer['id'], array: FormArray) =>  {
      return fields.reduce((obj, [_, __, prop], i) => ({ ...obj, [prop]: array.controls[i].value }), { id } as Customer);
    };

    return [
      getCustomerData(id1, (this.form.get('profiles') as FormControl).get('A') as FormArray),
      getCustomerData(id2, (this.form.get('profiles') as FormControl).get('B') as FormArray)
    ];
  }

  ngOnDestroy(): void {}
}
