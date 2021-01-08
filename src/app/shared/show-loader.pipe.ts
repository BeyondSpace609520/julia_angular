import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showLoader'
})
export class ShowLoaderPipe implements PipeTransform {

  transform(id: string): boolean {
    return false;
  }

}
