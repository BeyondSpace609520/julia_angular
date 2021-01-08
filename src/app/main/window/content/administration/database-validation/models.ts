export type ValidationState = 'OK' | 'ERROR' | string;

export interface ValidateAllResponse {
    atLeastOneEntityGroup: ValidationState;
    atLeastOneAgeGroup: ValidationState;
    ageGroupRangeValidation: ValidationState;
    validVisitorsTax: ValidationState;
    atLeastOneActiveServiceType: ValidationState;
    atLeastOneActiveServiceTypeAndSTDServiceTypeForEachEntityGroup: ValidationState;
    missingRoomPrices: ValidationState;
    cleanupCharge: ValidationState;
    petsSmall: ValidationState;
    petsLarge: ValidationState;
}

export interface RoomPriceError {
    number: string;
    name: string;
}
