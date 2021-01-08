import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from './loader-types';
import { ValidateAllResponse, ValidationState } from './models';

interface ValidationItem {
  label: string;
  key: string;
  clickable?: (state: ValidationState) => boolean;
  click?: () => void;
  tooltip?: (state: ValidationState) => string | null;
}

enum ValidationContent {
  ROOM_PRICE_ERRORS
}

@Component({
  selector: 'app-database-validation',
  templateUrl: './database-validation.component.pug',
  styleUrls: ['./database-validation.component.sass']
})
export class DatabaseValidationComponent implements OnInit {

  public validations: ValidateAllResponse;
  public activeValidationContent?: ValidationContent;

  public items: ValidationItem[] = [
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_AtLeastOneEntityGroup',
      key: 'atLeastOneEntityGroup'
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_AtLeastOneAgeGroup',
      key: 'atLeastOneAgeGroup'
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_AtLeastOneServiceType',
      key: 'atLeastOneActiveServiceType'
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_AtLeastOneActiveAndSTDServiceTypeForEachEntityGroup',
      key: 'atLeastOneActiveServiceTypeAndSTDServiceTypeForEachEntityGroup'
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_MissingEntityGroupPrices',
      key: 'missingRoomPrices',
      clickable: state => state !== 'OK',
      click: () => this.activeValidationContent = ValidationContent.ROOM_PRICE_ERRORS
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_AgeGroupRangeValidation',
      key: 'ageGroupRangeValidation',
      tooltip: state => state !== 'OK' ? state : null
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_VisitorsTaxRangeValidation',
      key: 'validVisitorsTax',
      tooltip: state => state !== 'OK' ? state : null
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_CleanupCharge',
      key: 'cleanupCharge',
      tooltip: state => state !== 'OK' ? 'BackEnd_WikiLanguage.REP_DBValid_MissingPrice' : null
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_PetsLarge',
      key: 'petsLarge',
      tooltip: state => state !== 'OK' ? 'BackEnd_WikiLanguage.REP_DBValid_MissingPrice' : null
    },
    {
      label: 'BackEnd_WikiLanguage.REP_DBValid_PetsSmall',
      key: 'petsSmall',
      tooltip: state => state !== 'OK' ? 'BackEnd_WikiLanguage.REP_DBValid_MissingPrice' : null
    },
  ];

  public isLoading: Observable<boolean>;
  public isContentLoading: Observable<boolean>;

  public ValidationContent = ValidationContent;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD);
    this.isContentLoading = this.loaderService.isLoading(LoaderType.CONTENT);
  }

  @Loading(LoaderType.LOAD)
  public async refresh(): Promise<void> {
    this.activeValidationContent = undefined;
    this.validations = await this.apiClient.validateAll().toPromise();
  }

  ngOnInit(): void {
    this.refresh();
  }

}
