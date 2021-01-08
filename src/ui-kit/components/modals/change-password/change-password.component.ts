import { AuthService } from '@/app/auth/auth.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { MessageType } from '@/ui-kit/components/message/message.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PasswordErrors, passwordValidator } from '../../../validators/password.validator';
import { Message } from './models';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

const loadingId = 'CHANGE-PASSWORD';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnDestroy {
  private formValid: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  formValid$: Observable<boolean> = this.formValid.asObservable().pipe(untilDestroyed(this));

  form: FormGroup;
  isLoading: Observable<boolean>;
  message?: Message;
  newPassword: string;
  newPasswordErrors: PasswordErrors | null | undefined;

  constructor(
    public loaderService: LoaderService,
    private authService: AuthService,
  ) {
    this.isLoading = this.loaderService.isLoading(loadingId);
    this.setupForm();
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.onSubmit();
    }
  }

  @Loading(loadingId)
  async onSubmit(): Promise<void> {
    if (!this.formValid) {
      return;
    }
    this.hideMessage();
    const usernameControl = this.form.get('username');
    const username = usernameControl ? usernameControl.value : '';
    const passwordControl = this.form.get('oldPassword');
    const oldPassword = passwordControl ? passwordControl.value : '';
    const newPasswordControl = this.form.get('newPassword');
    const newPassword = newPasswordControl ? newPasswordControl.value : '';
    const confirmPasswordControl = this.form.get('confirmPassword');
    const confirmPassword = confirmPasswordControl ? confirmPasswordControl.value : '';
    if (newPassword !== confirmPassword) {
      this.showMessage('BackEnd_WikiLanguage.PW_ConfirmErrorMessage', 'error');
      return;
    }

    const login = await this.authService.login(username, oldPassword);

    if (!login) {
      this.showMessage('BackEnd_WikiLanguage.LS_LoginErrorMessage', 'error');
      return;
    }

    const result = await this.authService.changePassword(username, oldPassword, newPassword, login.accessToken);

    if (result) {
      this.authService.logout('password-change');
    } else {
      this.showMessage('BackEnd_WikiLanguage.PW_ErrorMessage', 'error');
    }
  }

  private hideMessage(): void {
    this.message = undefined;
  }

  private setupForm(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, passwordValidator()]),
      confirmPassword: new FormControl('', [Validators.required, passwordValidator()])
    });

    this.form.statusChanges.pipe(untilDestroyed(this)).subscribe(status => {
      this.formValid.next(status === 'VALID');
    });

    const newPasswordControl = this.form.get('newPassword');
    newPasswordControl && newPasswordControl.valueChanges.pipe(untilDestroyed(this)).subscribe(password => {
      this.newPassword = password;
      this.newPasswordErrors = newPasswordControl.errors as (PasswordErrors | null | undefined);
    });
  }

  private showMessage(text: string, type: MessageType = 'default'): void {
    this.message = {text, type};
  }

  ngOnDestroy(): void {}

}
