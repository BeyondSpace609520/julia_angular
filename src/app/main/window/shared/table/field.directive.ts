import { Directive, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'app-table ng-template'
})
export class TableFieldDirective {

  @Input() label!: string;
  @Input() sortable?: string;
  @Input() classNames?: string;
  @Input() width?: number;
  @Input() widthIsPercent?: boolean;

  public calculatedWidth: number | undefined;

  constructor() { }

}
