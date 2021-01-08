// https://trello.com/c/zXarfET1/190-edited-customer-admin-guest-registration-create-registration-form-ii-guest-information
export function validatePostCode(value: number, countryId: number | null): boolean {
  switch (countryId) {
    case 15: // Austria
      return value >= 1000 && value <= 9999;
    case 81: // Germany
      return (value >= 1000 && value <= 42999) || (value >= 44000 && value <= 61999) || (value >= 63000 && value <= 99999);
    default:
      return value >= 10;
  }
}

export function validateTravelDocument(customerCountryId: number, countryId: number | null): boolean {
    return (countryId === 15 && customerCountryId === 15)
        || (countryId === 81 && customerCountryId === 81)
        || customerCountryId === 213;
}
