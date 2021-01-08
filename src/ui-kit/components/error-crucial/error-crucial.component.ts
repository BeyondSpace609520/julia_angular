import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-error-crucial',
    templateUrl: './error-crucial.component.html',
    styleUrls: ['./error-crucial.component.scss']
  })
  export class ErrorCrucialComponent {
    @Input() subHeadline = '';
    @Input() errorMessage = '';
  }
