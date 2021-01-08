import { Component } from '@angular/core';

import { GuestRegistrationConfigService } from '../../guest-registration-config.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.pug',
  styleUrls: ['./company.component.sass']
})
export class CompanyComponent {

  constructor(
    public guestRegistrationConfigService: GuestRegistrationConfigService
  ) { }
}
