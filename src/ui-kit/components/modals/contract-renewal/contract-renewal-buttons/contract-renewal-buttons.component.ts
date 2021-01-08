import { ContractRenewalButtonSettings, ContractRenewalFormState } from '@/ui-kit/components/modals/contract-renewal/models';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-contract-renewal-buttons',
  templateUrl: './contract-renewal-buttons.component.html',
  styleUrls: ['./contract-renewal-buttons.component.sass']
})
export class ContractRenewalButtonsComponent {

  @Input() formState: ContractRenewalFormState;
  @Output() buttonPress = new EventEmitter<ContractRenewalButtonSettings['type']>();

  readonly buttons: ContractRenewalButtonSettings[] = [
    {
      type: 'submit',
      label: 'BackEnd_WikiLanguage.CRF_SubmitButton',
      buttonClass: 'primary',
      disableOnInvalidForm: true
    },
    {
      type: 'previous',
      label: 'BackEnd_WikiLanguage.CRF_PreviousButton',
      buttonClass: 'secondary',
      disableOnInvalidForm: false
    },
    {
      type: 'next',
      label: 'BackEnd_WikiLanguage.CRF_NextButton',
      buttonClass: 'primary',
      disableOnInvalidForm: true
    },
    {
      type: 'remindMeLater',
      label: 'BackEnd_WikiLanguage.CRF_RemindMeLaterButton',
      buttonClass: 'secondary',
      disableOnInvalidForm: false
    },
    {
      type: 'upgrade',
      label: 'BackEnd_WikiLanguage.CRF_UpgradeButton',
      buttonClass: 'primary',
      disableOnInvalidForm: false
    },
    {
      type: 'close',
      label: 'BackEnd_WikiLanguage.CRF_CloseButton',
      buttonClass: 'primary',
      disableOnInvalidForm: false
    },
    {
      type: 'closeWithoutRecommendation',
      label: 'BackEnd_WikiLanguage.CRF_CloseWithoutRecommendationButton',
      buttonClass: 'secondary',
      disableOnInvalidForm: false
    },
    {
      type: 'recommend',
      label: 'BackEnd_WikiLanguage.CRF_RecommendButton',
      buttonClass: 'primary',
      disableOnInvalidForm: true
    },
    {
      type: 'sepaSubmit',
      label: 'BackEnd_WikiLanguage.CRF_SEPASubmitButton',
      buttonClass: 'primary',
      disableOnInvalidForm: true
    }
  ];

  constructor() { }

}
