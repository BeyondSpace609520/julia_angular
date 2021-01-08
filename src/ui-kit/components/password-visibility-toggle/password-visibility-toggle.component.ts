import { Component, HostListener, Input, OnInit } from '@angular/core';
import { PasswordInputDirective } from '../../directives/password-input.directive';

@Component({
  selector: 'app-password-visibility-toggle',
  templateUrl: './password-visibility-toggle.component.html',
  styleUrls: ['./password-visibility-toggle.component.scss']
})
export class PasswordVisibilityToggleComponent implements OnInit {

  @Input() passwordInput: PasswordInputDirective;
  @HostListener('click') onClick(): void {
    this.passwordInput.toggleType();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
