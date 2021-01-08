import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canAnonymize'
})
export class CanAnonymizePipe implements PipeTransform {

  transform(existingBillNo: boolean, bookingId: number | null, customerId: number): boolean {
    return existingBillNo && bookingId === null && customerId > 0;
  }

}
