import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

import { PermissionService } from './permission.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'permission',
  templateUrl: 'permission.component.pug',
  styleUrls: ['permission.component.sass']
})
export class PermissionComponent implements OnChanges {

  @Input() id: string | null = null; // global permission identifier (based on company details, keys, etc)
  @Input() tooltip: string;
  @Input() dontShow?: string | boolean;
  @Input() condition = true; // local condition
  @Input() or = false; // local condition

  @HostBinding('hidden') hidden = false;
  @HostBinding('class.disabled') disabled: boolean;

  constructor(
    private permissionService: PermissionService,
  ) {}

  private setDisabled(): void {
    if (this.id && !this.permissionService.can[this.id]) {
      this.disabled = true;
      return;
    }
    this.disabled = !(this.condition || this.or);
  }

  private setHidden(): void {
    this.hidden = this.disabled && this.dontShow !== undefined;
  }

  ngOnChanges({id, condition, dontShow, tooltip}: SimpleChanges): void {
    if (id || condition) {
      this.setDisabled();
      if (this.dontShow !== undefined) {
        this.setHidden();
      }
    }

    if (id || dontShow) {
      this.setHidden();
    }
  }
}
