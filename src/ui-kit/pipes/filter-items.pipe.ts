import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItems'
})
export class FilterItemsPipe implements PipeTransform {

  transform<T extends {}>(items: T[] | undefined, filter: string, key: string): T[] {
    if (!items || items.length === 0 || filter === '') {
      return items || [];
    }
    return items.filter(item => item.hasOwnProperty(key) && (item[key] as string).toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }

}
