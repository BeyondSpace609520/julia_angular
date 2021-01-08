import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-statistics-filter',
  templateUrl: './statistics-filter.component.pug',
  styleUrls: ['./statistics-filter.component.sass']
})
export class StatisticsFilterComponent implements OnInit {
  @Input() expiryOptions: {label: string, value: string}[];
  @Output() filter = new EventEmitter<StatisticsFilterData>();
  @Output() exportExcel = new EventEmitter<void>();

  public form: FormGroup;

  constructor() { }

  public onFilter(): void {
    if (this.form) {
      this.filter.emit({
        expiry: this.form.getRawValue().expiry
      });
    }
  }

  public onExportExcel(): void {
    this.exportExcel.emit();
  }

  ngOnInit() {
    this.form = new FormGroup({
      expiry: new FormControl('all'),
    });
  }

}

export interface StatisticsFilterData {
  expiry: string;
}
