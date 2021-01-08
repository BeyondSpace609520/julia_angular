import { Pipe, PipeTransform } from '@angular/core';

import { Pricing } from './models';

export type AgeGroup = Pricing['ageGroups'][0];

@Pipe({
  name: 'ageGroupFormat',
})
export class AgeGroupFormatPipe implements PipeTransform {
  transform(group: AgeGroup): string {
    if (group.from !== group.to) {
      return group.from + ' - ' + group.to + ' (' + group.percDiscount + '%)';
    } else {
      return group.from + ' (' + group.percDiscount + '%)';
    }
  }
}
