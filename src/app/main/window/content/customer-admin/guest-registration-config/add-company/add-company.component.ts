import { Component, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ApiRegistrationFormService } from '@/app/helpers/api/api-registration-form.service';
import { subscribeToFormStateChange } from '@/app/main/window/shared/forms/utils';
import { FormState } from '@/app/shared/forms/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.pug',
  styleUrls: ['./add-company.component.sass']
})
export class AddCompanyComponent implements OnDestroy {
  public isLoading: Observable<boolean>;
  private formState = new BehaviorSubject<FormState>({
    valid: false,
    dirty: false,
    touched: false
  });

  @Output() formStateChange = this.formState.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged((previous: FormState, current: FormState) => {
      return (
        previous.valid === current.valid
        && previous.dirty === current.dirty
        && previous.touched === current.touched
      );
    })
  );

  public form: FormGroup;

  constructor(
    private apiRegistrationFormService: ApiRegistrationFormService,
    private loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.AddConfiguration);
    const validators: ValidatorFn[] = [
      Validators.required,
      Validators.minLength(2)
    ];
    this.form = new FormGroup({
      name: new FormControl('', validators)
    });
    subscribeToFormStateChange(this, this.form, this.formState);
  }

  @Loading(LoaderType.AddConfiguration)
  public async save(): Promise<number | null> {
    return this.apiRegistrationFormService.newConfiguration((this.form.get('name') as FormControl).value).toPromise();
  }

  ngOnDestroy(): void {}
}
