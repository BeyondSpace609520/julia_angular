export interface ServiceTypeForPeriod {
  isDefault: 'on' | 'off';
  st_id: string;
  st_name: string;
  stl_name: string;
}

export interface MinMaxPersons {
  bc_minPersons: number;
  bc_maxPersons: number;
}

export interface PricingForBEFE {
  totalPriceAdults: number;
  totalPriceRoom: number;
  totalPriceChildren: number;
  totalPriceCatering: number;
  totalPriceVisitorsTax: number;
  totalPricePets: number;
  totalPriceCleanUp: number;
  totalChargeShortStay: number;
  totalDiscountLastMinute: number;
  totalLongStayDiscount: number;
  totalEarlyBirdDiscount: number;
  totalPriceCot: number;
  totalPriceGarage: number;
  totalChargingSchemeCharges: number;
  maxCots: number | string;
  maxGarages: number | string;
}

export interface RefreshShoppingCartPrices {
  eId: number;
  arrivalDate: string;
  nightsStay: number;
  adults: number;
  children: number;
  birthDates: string;
  smallPets: number;
  largePets: number;
  catering: string;
  cots: number;
  garages: number;
}

export interface RawRefreshShoppingCartPrices {
  adults: number;
  babyBed: boolean;
  roomId: string;
  children: number;
  childrenAges: Date[]
  fromDate: Date;
  largePets: number;
  nights: number;
  parkingSpace: boolean;
  serviceType: string;
  smallPets: number;
}
