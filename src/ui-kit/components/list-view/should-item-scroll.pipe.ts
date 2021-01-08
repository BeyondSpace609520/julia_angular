import { isItemSelected } from '@/ui-kit/components/list-view/is-item-selected.pipe';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shouldItemScroll'
})
export class ShouldItemScrollPipe implements PipeTransform {

  transform<T extends {}>(autoScroll: boolean, selected: T | number | string | null, item: T, identifierField: string): boolean {
    if (!autoScroll) {
      return false;
    }
    return isItemSelected(selected, item, identifierField);
  }

}
