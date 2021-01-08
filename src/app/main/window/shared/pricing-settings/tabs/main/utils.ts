import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { Observable, UnaryFunction } from 'rxjs';

import { Pricing } from '../../models';
import { AgeGroup } from './age-groups/age-groups.service';

// update ages price according to adults price
export function syncingAgeGroupPrices(
  group: FormGroup,
  ageGroups: (AgeGroup | null)[],
  pipeFunc: UnaryFunction<unknown, Observable<number | null>>,
  priceFunc: (() => number | null) | null = null
) {
  (group.get('adultPrice') as FormControl).valueChanges
    .pipe(pipeFunc)
    .subscribe((price: number) => {
      const ages = (group.get('agesPrice') as FormArray).controls;

      if (typeof priceFunc === 'function') {
        const newPrice = priceFunc();
        if (newPrice) {
          price = newPrice;
        }
      }

      if ((group.get('adultPrice') as FormGroup).dirty) {
        ages.forEach((ageControl, i) => {
          const age = ageGroups[i];

          if (!age) {
            return;
          }
          const discont = age.percDiscount / 100;

          ageControl.setValue(price === null ? 0 : price - price * discont);
        });
      }
    });
}
