import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-change-password-buttons',
  templateUrl: './change-password-buttons.component.html',
  styleUrls: ['./change-password-buttons.component.sass']
})
export class ChangePasswordButtonsComponent {

  @Input() formValid = false;

  cancel = new EventEmitter();
  submit = new EventEmitter();

  constructor() { }

}
