import { isPrice, parsePrice } from './currency';
import { SortEvent } from './sortable.directive';

export function sort(items: any[], rule: SortEvent | null) {
  if (!rule) {
    return items;
  }

  return [...items].sort((a, b) => {
    const val1 = a[rule.column];
    const val2 = b[rule.column];
    const sign = rule.direction === 'asc' ? 1 : -1;

    if (val1 instanceof Date && val2 instanceof Date) {
      return sign * (val1.getTime() - val2.getTime());
    }

    if (Number.isFinite(val1) && Number.isFinite(val1)) {
      return sign * (val1 - val2);
    }

    if (typeof val1 === 'string' && typeof val2 === 'string' && isPrice(val1)) {
      return sign * (parsePrice(val1) - parsePrice(val2));
    }

    return val1 > val2 ? sign : -sign;
  });
}
