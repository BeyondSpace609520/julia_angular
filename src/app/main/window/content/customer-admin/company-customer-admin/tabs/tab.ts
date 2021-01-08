import { Input } from '@angular/core';

import { Customer } from '../../../../shared/customer/models';

export abstract class TabComponent {
  @Input() public item: Customer;
}
