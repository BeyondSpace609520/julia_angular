import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {

  @Input() text?: string;
  @Input() type: MessageType = 'default';
  @HostBinding('class') typeClass;

  constructor() { }

  private setTypeClass(): void {
    this.typeClass = 'type-' + this.type;
  }

  ngOnInit(): void {
    this.setTypeClass();
  }

  ngOnChanges({type}: SimpleChanges): void {
    if (type) {
      this.setTypeClass();
    }
  }

}

export type MessageType = 'default' | 'success' | 'error' | 'warning';
