import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canAddProduct'
})
export class CanAddProductPipe implements PipeTransform {

  transform(forceEdit: boolean, existingBillNo: boolean): boolean {
    return forceEdit || !existingBillNo;
  }

}
