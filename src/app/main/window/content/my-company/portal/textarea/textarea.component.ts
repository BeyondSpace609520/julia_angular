import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.pug',
  styleUrls: ['./textarea.component.sass']
})
export class TextareaComponent {

  @Input() label!: string;
  @Input() max!: number | string; // max length
  @Input() ngModel: string;

  get remaining() {
    return this.ngModel ? +this.max - this.ngModel.length : '';
  }
}
