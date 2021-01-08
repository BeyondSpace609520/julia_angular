import { Injectable, OnDestroy } from '@angular/core';

import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { ReportingClientProvider } from '@/app/main/window/content/customer-admin/guest-registration-config/models';
import { LocalRoomCategory } from '@/app/main/window/content/services/special-offers/models';
import { UserService } from '../auth/user.service';
import { CompanyDetails } from '../main/models';
import { FormOption } from '../main/shared/form-data.service';
import {
  GroupGuestCounty,
  RegistrationGuestTypes,
  RegistrationTaxType,
} from '../main/window/content/customer-admin/create-registration-form/models';
import { HotelRegistrationRecord, RegistrationType } from '../main/window/content/customer-admin/guest-registration/models';
import { BlockDates } from '../main/window/content/pricing-admin/season-periods/models';
import { ApiAppService } from './api/api-app.service';
import { ApiCompanyService } from './api/api-company.service';
import { ApiCustomerAdminService } from './api/api-customer-admin.service';
import { ApiRegistrationFormService } from './api/api-registration-form.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService implements OnDestroy {
  private store: CacheStore = {};

  constructor(
    private apiAppService: ApiAppService,
    private apiCustomerAdminService: ApiCustomerAdminService,
    private apiRegistrationFormService: ApiRegistrationFormService,
    private apiCompanyService: ApiCompanyService,
    private userService: UserService,
  ) {
    this.setupCache();
    this.listenToLoginChanges();
  }

  public async getCompanyDetails(forced?: boolean): Promise<CompanyDetails> {
    return checkAndReturnData<CompanyDetails>(this.store.companyDetails, forced);
  }

  public getCompanyDetailsSnapshot(): CompanyDetails {
    return getCachedData(this.store.companyDetails, {} as CompanyDetails);
  }

  public async getCountriesForGuestGroups(hotelId: HotelRegistrationRecord['id'], forced?: boolean): Promise<GroupGuestCounty[]> {
    const parameters: CacheParameter[] = [{name: 'hotelId', value: hotelId}];
    return checkAndReturnData<GroupGuestCounty[]>(this.store.countriesForGuestGroups, forced, parameters);
  }

  public async getCustomerStatusOptions(forced?: boolean): Promise<FormOption<number>[]> {
    return checkAndReturnData<FormOption<number>[]>(this.store.customerStatusOptions, forced);
  }

  public async getGuestRegistrationHotels(forced?: boolean): Promise<HotelRegistrationRecord[]> {
    return checkAndReturnData<HotelRegistrationRecord[]>(this.store.guestRegistrationHotels, forced);
  }

  public async getGuestRegistrationTypes(forced?: boolean): Promise<RegistrationType[]> {
    return checkAndReturnData<RegistrationType[]>(this.store.guestRegistrationTypes, forced);
  }

  public async getGuestTypes(forced?: boolean): Promise<RegistrationGuestTypes> {
    return checkAndReturnData<RegistrationGuestTypes>(this.store.guestTypes, forced);
  }

  public async getHotelSoftwareList(forced?: boolean): Promise<FormOption<number>[]> {
    return checkAndReturnData<FormOption<number>[]>(this.store.hotelSoftwareList, forced);
  }

  public async getCentralSalutationList(forced?: boolean): Promise<FormOption<number>[]> {
    return checkAndReturnData<FormOption<number>[]>(this.store.centralSalutationList, forced);
  }

  public async getLocalRoomCategories(forced?: boolean): Promise<LocalRoomCategory[]> {
    return checkAndReturnData<LocalRoomCategory[]>(this.store.localRoomCategories, forced);
  }

  public async getBlockedDates(forced?: boolean): Promise<BlockDates> {
    return checkAndReturnData<BlockDates>(this.store.blockedDates, forced);
  }

  public async getRegistrationTaxTypes(
    hotelId: HotelRegistrationRecord['id'],
    used?: boolean,
    forced?: boolean
  ): Promise<RegistrationTaxType[]> {
    const parameters: CacheParameter[] = [
      {name: 'hotelId', value: hotelId},
      {name: 'used', value: used}
    ];
    return checkAndReturnData<RegistrationTaxType[]>(this.store.registrationTaxTypes, forced, parameters);
  }

  public async getReportingClientProviders(forced?: boolean): Promise<ReportingClientProvider[]> {
    return checkAndReturnData<ReportingClientProvider[]>(this.store.reportingClientProviders, forced);
  }

  public async getResellerList(forced?: boolean): Promise<FormOption<number>[]> {
    return checkAndReturnData<FormOption<number>[]>(this.store.resellerList, forced);
  }

  private listenToLoginChanges(): void {
    this.userService.loggedIn$.pipe(
      untilDestroyed(this)
    ).subscribe(loggedIn => {
      if (!loggedIn) {
        this.resetAllCache();
      }
    });
  }

  private resetAllCache(): void {
    Object.keys(this.store).forEach(cacheName => {
      if (this.store.hasOwnProperty(cacheName)) {
        this.store[cacheName].state = [];
      }
    });
  }

  private setupCache(): void {
    this.store.companyDetails = createDataCache<CompanyDetails>(
      this.apiAppService,
      'getCompanyDetails',
      {} as CompanyDetails
    );
    this.store.countriesForGuestGroups = createDataCache<GroupGuestCounty[]>(
      this.apiRegistrationFormService,
      'getCountriesForGuestGroups',
      []
    );
    this.store.customerStatusOptions = createDataCache<FormOption<number>[]>(
      this.apiCustomerAdminService,
      'getCustomerStatusOptions',
      []
    );
    this.store.guestRegistrationHotels = createDataCache<HotelRegistrationRecord[]>(
      this.apiRegistrationFormService,
      'getGuestRegistrationHotels',
      []
    );
    this.store.guestRegistrationTypes = createDataCache<RegistrationType[]>(
      this.apiRegistrationFormService,
      'getGuestRegistrationTypes',
      []
    );
    this.store.guestTypes = createDataCache<RegistrationGuestTypes>(
      this.apiRegistrationFormService,
      'getGuestTypes',
      {} as RegistrationGuestTypes
    );
    this.store.hotelSoftwareList = createDataCache<FormOption<number>[]>(
      this.apiCustomerAdminService,
      'getCustomerHotelOptions',
      []
    );
    this.store.localRoomCategories = createDataCache<LocalRoomCategory[]>(
      this.apiAppService,
      'getLocalRoomCategories',
      []
    );
    this.store.registrationTaxTypes = createDataCache<RegistrationTaxType[]>(
      this.apiRegistrationFormService,
      'getRegistrationTaxTypes',
      []
    );
    this.store.reportingClientProviders = createDataCache<ReportingClientProvider[]>(
      this.apiRegistrationFormService,
      'getProviders',
      []
    );
    this.store.resellerList = createDataCache<FormOption<number>[]>(
      this.apiCustomerAdminService,
      'getCustomerResellerOptions',
      []
    );
    this.store.centralSalutationList = createDataCache<FormOption<number>[]>(
      this.apiAppService,
      'getCentralSalutations',
      []
    );
    this.store.blockedDates = createDataCache<BlockDates>(
      this.apiCompanyService,
      'getGeneralSettings',
      {} as BlockDates
    );
  }

  ngOnDestroy(): void {}
}

const defaultExpiration = 3600;

export interface CacheParameter {
  name: string;
  value: any;
}

interface CacheStore {
  [name: string]: DataCache<any>;
}

interface DataCache<T> {
  state: DataState<T>[];
  expiration: number;
  defaultValue: T;
  apiService: AvailableApiService;
  apiFunctionName: string;
}

interface DataState<T> {
  data: T;
  lastUpdated: Dayjs;
  parameters?: CacheParameter[];
}

type AvailableApiService =
  | ApiAppService
  | ApiCustomerAdminService
  | ApiRegistrationFormService
  | ApiCompanyService;

async function checkAndReturnData<T>(
  cache: DataCache<T>,
  forced?: boolean,
  parameters?: CacheParameter[]
): Promise<T> {
  if (forced || checkIfNeedsUpdate(cache, parameters)) {
    const functionParameters = parameters ? parameters.map(parameter => parameter.value) : [];
    if (typeof cache.apiService[cache.apiFunctionName] !== 'function') {
      return cache.defaultValue;
    }
    storeDataState<T>(
      cache,
      await cache.apiService[cache.apiFunctionName].apply(cache.apiService, functionParameters).toPromise(),
      parameters
    );
  }
  return getCachedData(cache, cache.defaultValue, parameters);
}

function checkIfNeedsUpdate<T>(cache: DataCache<T>, parameters?: CacheParameter[]): boolean {
  if (!cache.state || cache.state.length === 0) {
    return true;
  }
  const stateIndex = getCachedStateIndex(cache, parameters);
  if (stateIndex < 0) {
    return true;
  }
  const now = dayjs();
  return (now.isAfter(cache.state[stateIndex].lastUpdated.add(cache.expiration, 'second')));
}

function createDataCache<T>(
  apiService: AvailableApiService,
  apiFunctionName: string,
  defaultValue: T,
  expiration: number = defaultExpiration
): DataCache<T> {
  return {
    state: [],
    expiration,
    defaultValue,
    apiService,
    apiFunctionName
  };
}

function getCachedStateIndex<T>(cache: DataCache<T>, parameters?: CacheParameter[]): number {
  if (!cache || !cache.state || cache.state.length === 0) {
    return -1;
  }
  if (!parameters || parameters.length === 0) {
    return cache.state.findIndex(s => s.parameters === undefined);
  } else {
    return cache.state.findIndex(s => {
      if (!s.parameters || s.parameters.length !== parameters.length) {
        return false;
      }
      return parameters.every(parameter => {
        return s.parameters && s.parameters.find(p => p.name === parameter.name && p.value === parameter.value);
      }, false);
    });
  }
}

function getCachedData<T>(cache: DataCache<T>, fallback: T, parameters?: CacheParameter[]): T {
  const stateIndex = getCachedStateIndex(cache, parameters);
  return stateIndex >= 0 ? cache.state[stateIndex].data : fallback;
}

function storeDataState<T>(cache: DataCache<T>, data: T, parameters?: CacheParameter[]): DataState<T> {
  const newState = {
    data,
    lastUpdated: dayjs(),
    parameters: (parameters && parameters.length > 0 ? parameters : undefined)
  };
  const stateIndex = getCachedStateIndex(cache, parameters);
  if (stateIndex < 0) {
    cache.state.push(newState);
  } else {
    cache.state[stateIndex] = newState;
  }
  return newState;
}
