import { AbstractControl } from '@angular/forms';

import { OperatorFunction } from 'rxjs';

export function clampFormControls(min: AbstractControl, normal: AbstractControl, max: AbstractControl, untilOperator: OperatorFunction<any, number>, emitEvent = true) {
    min.valueChanges.pipe(untilOperator).subscribe(newMin => {
        if (newMin > normal.value) normal.setValue(newMin, { emitEvent });
        if (newMin > max.value) max.setValue(newMin, { emitEvent });
    });
    normal.valueChanges.pipe(untilOperator).subscribe(newNormal => {
        if (newNormal < min.value) min.setValue(newNormal, { emitEvent });
        if (newNormal > max.value) max.setValue(newNormal, { emitEvent });
    });
    max.valueChanges.pipe(untilOperator).subscribe(newMax => {
        if (newMax < normal.value) normal.setValue(newMax, { emitEvent });
        if (newMax < min.value) min.setValue(newMax, { emitEvent });
    });
}