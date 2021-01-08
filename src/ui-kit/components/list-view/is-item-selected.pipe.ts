import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isItemSelected'
})
export class IsItemSelectedPipe implements PipeTransform {

  transform<T extends {}>(selected: T | number | string | null, item: T, identifierField: string): boolean {
    return isItemSelected(selected, item, identifierField);
  }

}

export function isItemSelected<T extends {}>(selected: T | number | string | null, item: T, identifierField: string): boolean {
  if (!selected || !item || (identifierField && !item.hasOwnProperty(identifierField))) {
    return false;
  }
  if (identifierField && (typeof selected === 'number' || typeof selected === 'string')) {
    return item[identifierField] === selected;
  }
  if (identifierField && (selected.hasOwnProperty(identifierField))) {
    return selected[identifierField] === item[identifierField];
  }
  if (!identifierField) {
    return selected === item;
  }
  return false;
}
