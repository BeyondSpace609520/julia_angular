import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appPasswordInput]',
  exportAs: 'appPasswordInput'
})
export class PasswordInputDirective {

  @HostBinding('type') type: 'password' | 'text' = 'password';

  toggleType(): void {
    this.type = this.type === 'password' ? 'text' : 'password';
  }

  constructor() {}

}
