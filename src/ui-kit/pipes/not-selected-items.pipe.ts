import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notSelectedItems'
})
export class NotSelectedItemsPipe implements PipeTransform {

  transform<T>(identifier: number | string | null, items: T[], identifierField: string = 'id'): T[] {
    if (!items) {
      return [];
    }
    if (identifier === null || items.length === 0) {
      return items;
    }
    return items.filter(item => item[identifierField] !== identifier) || [];
  }

}
