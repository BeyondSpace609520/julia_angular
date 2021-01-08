import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '@/app/shared/module';
import { ActionComponent } from './action/action.component';
import { ColumnWidthPipe } from './column-width.pipe';
import { TableFieldDirective } from './field.directive';
import { ResizeHandleDirective } from './resize-handle.directive';
import { NgbdSortableHeaderDirective } from './sortable.directive';
import { TableComponent } from './table.component';

@NgModule({
  declarations: [TableFieldDirective, ActionComponent, NgbdSortableHeaderDirective, TableComponent, ColumnWidthPipe, ResizeHandleDirective],
  exports: [ActionComponent, TableComponent, NgbdSortableHeaderDirective, TableFieldDirective],
  imports: [
    CommonModule,
    SharedModule,
    NgbTooltipModule,
  ]
})
export class TableModule { }
