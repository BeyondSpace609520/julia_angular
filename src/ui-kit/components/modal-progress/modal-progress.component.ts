import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-progress',
  templateUrl: './modal-progress.component.html',
  styleUrls: ['./modal-progress.component.sass']
})
export class ModalProgressComponent {

  @Input() textHead: string;
  @Input() headStart?: boolean;
  @Input() progress!: Observable<number>;

  constructor() { }

}
