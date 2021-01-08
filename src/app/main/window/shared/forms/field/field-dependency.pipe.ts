import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'fieldDependency'
})
export class FieldDependencyPipe implements PipeTransform {
  transform(group: FormGroup, field: string): FormControl | null {
    if (!group || !field) {
      return null;
    }
    return group.get(field) as FormControl || null;
  }
}
