import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-simple-text',
  templateUrl: './modal-simple-text.component.html',
  styleUrls: ['./modal-simple-text.component.scss'],
})
export class ModalSimpleTextComponent implements OnInit {
  @Input() buttonCloseLabel = 'general.buttonClose.text';
  @Input() closable = false;
  @Input() modalType = 1;
  @Input() textHead: string;
  @Input() textBody: string;
  @Input() textBodyIsHTML: boolean;
  @Input() textBodyTitle: string;
  @Input() loadingAnimation = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
}
