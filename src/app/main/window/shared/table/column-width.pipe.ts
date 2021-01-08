import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnWidth'
})
export class ColumnWidthPipe implements PipeTransform {

  transform(calculatedWidthInPercent?: number, manualWidth?: number, manualWidthIsPercent?: boolean): string | undefined {
    if (calculatedWidthInPercent && calculatedWidthInPercent > 0) {
      return calculatedWidthInPercent + '%';
    }
    if (manualWidth && manualWidth > 0) {
      return manualWidth + (manualWidthIsPercent ? '%' : 'px');
    }
    return undefined;
  }

}
