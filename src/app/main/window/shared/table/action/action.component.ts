import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-action',
  templateUrl: './action.component.pug',
  styleUrls: ['./action.component.sass']
})
export class ActionComponent {
  @Input() icon!: string;
  @Input() subIcon?: string;
  @Input() tooltip!: string;
  @Input() active = true;
  @Input() disabled = false;
  @Input() rightTooltip = true;
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('style.pointer-events') get pointerEvents() {
    return this.active ? 'auto' : 'none';
  }
}
