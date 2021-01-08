import { ApiGlobalService } from '@/app/helpers/api/api-global.service';
import { ApiSupportFormService } from '@/app/helpers/api/api-support-form.service';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import {
  ContractRenewalButtonSettings, ContractRenewalData,
  ContractRenewalFormState, ContractRenewalFormView, ContractRenewalRequest, RecommendationFormData, RecommendationRequest, RenewalFormData,
} from '@/ui-kit/components/modals/contract-renewal/models';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

const loadingIdentifier = 'CONTRACT_RENEWAL';

@Component({
  selector: 'app-contract-renewal',
  templateUrl: './contract-renewal.component.html',
  styleUrls: ['./contract-renewal.component.sass']
})
export class ContractRenewalComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Output() formStateChange = new EventEmitter<ContractRenewalFormState>();
  @Output() remindMeLater = new EventEmitter();

  data: ContractRenewalData;
  formState: ContractRenewalFormState;
  isLoading: Observable<boolean>;
  renewalFormData: RenewalFormData = {};
  recommendationFormData: Partial<RecommendationFormData> = {};
  sepaErrorMessage?: string;

  constructor(
    public loaderService: LoaderService,
    private apiGlobalService: ApiGlobalService,
    private apiSupportFormService: ApiSupportFormService,
  ) {
    this.isLoading = this.loaderService.isLoading(loadingIdentifier);
  }

  init(data: ContractRenewalData): void {
    this.data = data;
    if (window.location.hash.match(/^#test-modal-success/)) {
      this.updateFormState({
        view: 'success'
      });
      return;
    }
    if (window.location.hash.match(/^#test-modal-error/)) {
      this.updateFormState({
        view: 'error'
      });
      return;
    }
    this.updateFormState({
      view: ['groupEBSN', 'groupEBEX'].includes(this.data.masterOppPG) ? 'paymentSelector' : 'newPricing'
    });
  }

  onButtonClick(buttonType: ContractRenewalButtonSettings['type']): void {
    switch (buttonType) {
      case 'submit':
        this.submit();
        break;
      case 'previous':
        this.previous();
        break;
      case 'next':
        this.next();
        break;
      case 'close':
      case 'closeWithoutRecommendation':
        this.close.emit();
        break;
      case 'upgrade':
        this.upgrade();
        break;
      case 'remindMeLater':
        this.remindMeLater.emit();
        break;
      case 'recommend':
        this.recommend();
        break;
      case 'sepaSubmit':
        this.sepaSubmit();
        break;
    }
  }

  updateFormState(formState: Partial<ContractRenewalFormState>): void {
    this.formState = {...this.formState, ...formState};
    this.formStateChange.emit(this.formState);
  }

  private next(): void {
    if (!this.formState.valid || !this.formState.nextStep) {
      return;
    }
    this.updateFormState({
      previousSteps: addPreviousStep(this.formState.view, this.formState.previousSteps),
      view: this.formState.nextStep,
      nextStep: undefined
    });
  }

  private previous(): void {
    if (!this.formState.previousSteps || this.formState.previousSteps.length === 0) {
      return;
    }
    const newView = this.formState.previousSteps.pop();
    this.updateFormState({
      previousSteps: this.formState.previousSteps,
      view: newView,
      nextStep: undefined
    });
  }

  private async recommend(): Promise<void> {
    const success = await this.sendRecommendation();
    if (success) {
      this.close.emit();
    }
  }

  @Loading(loadingIdentifier)
  private async sendRecommendation(): Promise<boolean> {
    if (!this.formState.valid) {
      return false;
    }
    try {
      const request: RecommendationRequest = {...this.recommendationFormData, accId: this.data.accountId} as RecommendationRequest;
      await this.apiSupportFormService.sendRecommendation(request).toPromise();
      return true;
    } catch (error) {
      console.error('The request failed', error);
      return true;
    }
  }

  private async sepaSubmit(): Promise<void> {
    this.sepaErrorMessage = undefined;
    if (!this.formState.valid) {
      return;
    }
    const ibanValid = await this.validateIBAN();
    if (ibanValid) {
      this.submit();
    } else {
      this.sepaErrorMessage = 'BackEnd_WikiLanguage.CRF_SEPAInvalidIBAN';
    }
  }

  private async submit(): Promise<void> {
    if (!this.formState.valid) {
      return;
    }
    const success = await this.submitPaymentSelector();
    this.updateFormState({view: success ? 'success' : 'error'});
  }

  @Loading(loadingIdentifier)
  private async submitPaymentSelector(): Promise<boolean> {
    try {
      if (!this.renewalFormData.option) {
        return false;
      }
      const result = await this.apiGlobalService.sendContractRenewal(createRenewalRequest(this.data, this.renewalFormData)).toPromise();
      if (result === 'success') {
        return true;
      } else {
        console.error('Unexpected response from the server: ', result);
        return false;
      }
    } catch (error) {
      console.error('The request failed', error);
      return false;
    }
  }

  @Loading(loadingIdentifier)
  private async validateIBAN(): Promise<boolean> {
    if (!this.formState.valid || !this.renewalFormData.sepa) {
      return false;
    }
    try {
      return await this.apiSupportFormService.sendIBANValidation(this.renewalFormData.sepa.iban).toPromise();
    } catch (error) {
      console.error('The request failed', error);
      return true;
    }
  }

  private upgrade(): void {
    const url = `https://upgrade.easybooking.eu/?id=${this.data.accountId}&pin=${this.data.pinCode}&v=recurring/'`;
    window.open(url, '_blank');
    this.close.emit();
  }

  ngOnInit(): void {}

}

function createRenewalRequest({accountId, masterOppId}: ContractRenewalData, {option, paymentMethod, sepa}: RenewalFormData): ContractRenewalRequest {
  const requestData: ContractRenewalRequest = {
    accId: accountId,
    masterOppId: masterOppId,
    selectedOption: option ? option.years.toString() : '',
    selectedPM: paymentMethod ? paymentMethod.toString() : undefined
  };
  if (sepa) {
    requestData.accountowner = sepa.accountHolder;
    requestData.iban = sepa.iban;
    requestData.sepa_address = sepa.address;
    requestData.sepa_city = sepa.city;
    requestData.sepa_country = sepa.country;
    requestData.sepa_postcode = sepa.postCode;
  }
  return requestData
}

function addPreviousStep(step?: ContractRenewalFormView, previousSteps?: ContractRenewalFormView[]): ContractRenewalFormView[] {
  if (!step) {
    return previousSteps || [];
  }
  if (!previousSteps) {
    return [step];
  }
  previousSteps.push(step);
  return previousSteps;
}
