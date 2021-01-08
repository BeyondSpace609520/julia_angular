import { Observable } from 'rxjs';

import { AnyChargingScheme, ChargingSchemeBody, ChargingSchemeDetail } from '../models';

export interface Editor {
    isValid(): Observable<boolean>;
    extract(): ChargingSchemeBody<ChargingSchemeDetail<AnyChargingScheme>>;
}
