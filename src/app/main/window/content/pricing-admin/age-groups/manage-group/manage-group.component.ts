import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { AgeGroup } from '../models';

@Component({
  selector: 'app-manage-group',
  templateUrl: './manage-group.component.pug',
  styleUrls: ['./manage-group.component.sass']
})
export class ManageGroupComponent implements OnChanges, OnDestroy {

  @Input() group!: AgeGroup;

  form: FormGroup;
  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  isGroupManaging() {
    return this.loaderService.isActive(LoaderType.MANAGE_AGE_GROUP);
  }

  ngOnChanges({ group }: SimpleChanges) {
    if (group.currentValue !== group.previousValue) {
      this.init(group.currentValue);
    }
  }

  public init(group?: AgeGroup, [fromAge, toAge]: [number, number] = [0, 0], onChange: (valid: boolean) => void = () => null) {
    this.form = new FormGroup({
      name: new FormControl(group ? group.name : '', Validators.required),
      from: new FormControl(group ? group.from : Math.min(fromAge, 16)),
      to: new FormControl(group ? group.to : Math.min(toAge, 17)),
      percDiscount: new FormControl(group ? group.percDiscount : 0),
    });
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => onChange(this.form.valid));
    this.form.updateValueAndValidity();
  }

  @Loading(LoaderType.MANAGE_AGE_GROUP)
  public async save(id: AgeGroup['id']): Promise<number | null> {

    const group: AgeGroup = {
      id,
      ...this.form.getRawValue()
    };

    return await this.apiClient.saveAgeGroup(group).toPromise();
  }

  ngOnDestroy() {}
}
