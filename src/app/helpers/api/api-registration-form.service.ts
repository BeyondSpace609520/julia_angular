import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WilkenPrintLinkResponse } from '@/app/helpers/api/api-registration-form.models';

import {
  CompanyDetailsSaveData, NumberRange, NumberRanges, RawNumberRanges,
  RawReportingClientProvider,
  ReportingClientProvider
} from '@/app/main/window/content/customer-admin/guest-registration-config/models';
import {
  prepareNumberRange,
  reduceNumberRanges,
  reduceReportingClientProvider
} from '@/app/main/window/content/customer-admin/guest-registration-config/reduce';
import {
  GroupGuestCounty,
  GuestsCategory, RawRegistrationGuestType, RawRegistrationTaxType,
  RegistrationGuestTypes, RegistrationTaxType
} from '../../main/window/content/customer-admin/create-registration-form/models';
import { reduceRegGuestType, reduceTaxType } from '../../main/window/content/customer-admin/create-registration-form/reduce';
import {
  BasicGuestRegistrationForm,
  HotelRegistrationRecord,
  RawHotelRegistrationRecord, RawRegistrationType,
  RegistrationType
} from '../../main/window/content/customer-admin/guest-registration/models';
import { reduceHotel } from '../../main/window/content/customer-admin/guest-registration/reduce';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiRegistrationFormService {

  constructor(private apiService: ApiService) { }

  public deleteConfiguration(hotelRecordId: HotelRegistrationRecord['id']): Observable<void> {
    return this.apiService.mainApiPost<void>(
      [hotelRecordId, 'appUser'],
      'registrationForm',
      'deleteConfiguration'
    );
  }

  public getCountriesForGuestGroups(hotelRecordId: HotelRegistrationRecord['id']): Observable<GroupGuestCounty[]> {
    return this.apiService.mainApiPost<{
      rfc_id: string;
      rfc_statsAssignement: string;
      rfc_country_id: string;
      rfc_postCodeFrom: string;
      rfc_postCodeUntil: string;
    }[]>([hotelRecordId, 'appUser'], 'registrationForm', 'getCountriesForGuestGroups').pipe(
      map(list => list.map(item => {
        return {
          value: +item.rfc_id,
          name: item.rfc_statsAssignement,
          countryId: +item.rfc_country_id,
          postCode: {
            from: item.rfc_postCodeFrom,
            until: item.rfc_postCodeUntil
          }
        } as GroupGuestCounty;
      }))
    );
  }

  public getGuestRegistrationHotels(): Observable<HotelRegistrationRecord[]> {
    return this.apiService.mainApiPost<RawHotelRegistrationRecord[]>(['appUser'], 'registrationForm', 'getGeneralSettings').pipe(
      map(list => list.filter(item => +item.rfgs_id  !== 0).map(reduceHotel))
    );
  }

  public getGuestRegistrationTypes(): Observable<RegistrationType[]> {
    const categories = [
      GuestsCategory.INDIVIDUAL,
      GuestsCategory.GROUP,
      GuestsCategory.DETAIL_GROUP
    ];

    return this.apiService.mainApiPost<RawRegistrationType[]>(['appUser'], 'registrationForm', 'getRegistrationTypes').pipe(
      map(list => list.map((item, i) => ({
        value: +item.rtl_registrationType_id,
        name: item.rtl_value,
        category: categories[i]
      })))
    );
  }

  public getGuestTypes(): Observable<RegistrationGuestTypes> {
    return this.apiService.mainApiPost<RawRegistrationGuestType[]>(['appUser'], 'registrationForm', 'getGuestTypes').pipe(
      map(reduceRegGuestType)
    );
  }

  public getNumberRanges(hotelRecordId: HotelRegistrationRecord['id']): Observable<NumberRanges> {
    return this.apiService.mainApiPost<RawNumberRanges>(
      [hotelRecordId, 'appUser'],
      'registrationForm',
      'getNumberRanges'
    ).pipe(
      map(reduceNumberRanges)
    );
  }

  public getProviders(): Observable<ReportingClientProvider[]> {
    return this.apiService.mainApiPost<RawReportingClientProvider[]>([], 'registrationForm', 'getProviders').pipe(
      map(list => list.map(reduceReportingClientProvider))
    );
  }

  public getRegistrationTaxTypes(hotelRecordId: HotelRegistrationRecord['id'], used = false): Observable<RegistrationTaxType[]> {
    return this.apiService.mainApiPost<RawRegistrationTaxType[]>(
      ['appUser', used ? 'justUsedOnes' : 'off', hotelRecordId],
      'registrationForm',
      'getRegistrationTaxTypes'
    ).pipe(
      map(list => list.length === 1 && 'noTaxtypes' in list[0] ? [] : list.map(reduceTaxType))
    );
  }

  public getWilkenCardPrintLink(formId: BasicGuestRegistrationForm['id']): Observable<string> {
    return this.apiService
      .mainApiPost<WilkenPrintLinkResponse>(
        [formId, 'appUser'],
        'registrationForm',
        'getWilkenGuestCardPrintLink'
      )
      .pipe(
        map((resp) => {
          if (resp.status === 'error') {
            throw new Error(`${resp.text} (${resp.code})`);
          }
          return resp.url;
        })
      );
  }

  public insertNumberRange(hotelRecordId: HotelRegistrationRecord['id']): Observable<void> {
    return this.apiService.mainApiPost<void>(
      [hotelRecordId, 'appUser'],
      'registrationForm',
      'insertNumberRange'
    );
  }

  public newConfiguration(name: string): Observable<number | null> {
    return this.apiService.mainApiPost<number[]>(
      [{rfgs_name: name}, 'appUser'],
      'registrationForm',
      'newConfiguration'
    ).pipe(map(response => (response && response.length > 0) ? response[0] : null));
  }

  public saveMyGuestTypes(hotelRecordId: HotelRegistrationRecord['id'], guestTypeIds: RegistrationTaxType['globalId'][]): Observable<void> {
    return this.apiService.mainApiPost<void>(
      [
        guestTypeIds.map(guestTypeId => {
          return {global_rtt_id: String(guestTypeId)};
        }),
        hotelRecordId,
        'appUser'
      ],
      'registrationForm',
      'saveMyGuestTypes'
    );
  }

  public setGeneralSettings(companyDetails: CompanyDetailsSaveData): Observable<void> {
    return this.apiService.mainApiPost<void>(
      [companyDetails, 'appUser'],
      'registrationForm',
      'setGeneralSettings'
    );
  }

  public updateNumberRanges(hotelRecordId: HotelRegistrationRecord['id'], ranges: NumberRange[]): Observable<void> {
    return this.apiService.mainApiPost(
      [
        hotelRecordId,
        ranges.map(range => prepareNumberRange(range.id, range.start, range.end)),
        'appUser'
      ],
      'registrationForm',
      'updateNumberRanges'
    );
  }

  public reorderProviders(hotels: HotelRegistrationRecord[]): Observable<void> {
    return this.apiService.mainApiPost(
      [
        hotels.map((hotel, index) => ({rfgs_id: hotel.id, rfgs_sortOrder: (index + 1)})),
        'appUser',
      ],
      'registrationForm',
      'reOrderProviders'
    );
  }
}
