import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressValue'
})
export class ProgressValuePipe implements PipeTransform {

  transform(progress: number, headStart: boolean): number {
    return Math.max(progress, (headStart ? 1 : 0));
  }

}
