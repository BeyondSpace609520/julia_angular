import { Pipe, PipeTransform } from '@angular/core';

import { ViewMode } from './models';

@Pipe({
  name: 'hasNumberRange'
})
export class HasNumberRangePipe implements PipeTransform {

  transform(activeTabId: ViewMode): boolean {
    return activeTabId === ViewMode.ARRIVED || activeTabId === ViewMode.DEPARTED;
  }

}
