import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectedItem'
})
export class SelectedItemPipe implements PipeTransform {

  transform<T>(item: T | number | string | null, items: T[], identifierField: string = 'id'): T | null {
    if (item === null || !items || items.length === 0) {
      return null;
    }
    const identifier = (typeof item === 'number' || typeof item === 'string') ? item : item[identifierField];
    return items.find(i => i[identifierField] === identifier) || null;
  }

}
