import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PasswordCheck } from './password-checks.models';
import { PasswordErrors, requirements } from '../../validators/password.validator';

@Component({
  selector: 'app-password-checks',
  templateUrl: './password-checks.component.html',
  styleUrls: ['./password-checks.component.scss']
})
export class PasswordChecksComponent implements OnChanges {

  @Input() errors: PasswordErrors | null | undefined;
  @Input() validated = false;

  checks: PasswordCheck[] = [];

  constructor() {
    Object.keys(requirements).forEach(requirementType => {
      if (requirements.hasOwnProperty(requirementType)) {
        this.checks.push({
          type: requirementType,
          label: requirements[requirementType].translate,
          labelParameters: requirements[requirementType].parameters,
          value: false
        });
      }
    });
  }

  private updateChecks(errors: PasswordErrors | null | undefined): void {
    if (errors === undefined) {
      this.checks.forEach(check => check.value = false);
    } else if (errors === null) {
      this.checks.forEach(check => check.value = true);
    } else {
      this.checks.forEach(check => check.value = !errors[check.type]);
    }
  }

  ngOnChanges({errors}: SimpleChanges): void {
    if (errors ) {
      this.updateChecks(errors.currentValue);
    }
  }

}
