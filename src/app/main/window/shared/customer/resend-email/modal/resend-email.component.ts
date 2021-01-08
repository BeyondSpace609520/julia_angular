import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader.types';

@Component({
  selector: 'app-resend-email',
  templateUrl: './resend-email.component.pug',
  styleUrls: ['./resend-email.component.sass']
})
export class ResendEmailComponent implements OnDestroy {

  form: FormGroup;
  isLoading: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.RESEND_EMAIL);
  }

  public init(eMailAddress, onChange: (valid) => void): void {
    this.form = new FormGroup({
      email: new FormControl(eMailAddress, [Validators.required, Validators.email])
    });
    onChange(this.form.valid);
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      onChange(this.form.valid);
    });
  }

  public getEmail(): string {
    return (this.form.get('email') as FormControl).value as string;
  }

  ngOnDestroy(): void {}
}
