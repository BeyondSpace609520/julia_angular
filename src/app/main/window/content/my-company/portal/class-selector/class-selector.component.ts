import { Component, Input } from '@angular/core';

import { FormOption } from '@/app/main/shared/form-data.service';

@Component({
  selector: 'app-class-selector',
  templateUrl: './class-selector.component.pug',
  styleUrls: ['./class-selector.component.sass']
})
export class ClassSelectorComponent {

  @Input() label!: string;
  @Input() ngModel: string;
  @Input() direction: string;

  classificationOptions: FormOption<number>[] = [
    { value: 0, name: '-' },
    { value: 2, name: '2' },
    { value: 3, name: '3' },
    { value: 4, name: '4' },
    { value: 5, name: '5' },
  ];

}
