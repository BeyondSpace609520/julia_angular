import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardIsAvailable'
})
export class CreditCardIsAvailablePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
