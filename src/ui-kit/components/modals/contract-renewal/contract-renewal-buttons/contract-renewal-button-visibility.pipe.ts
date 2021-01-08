import { ContractRenewalButtonSettings, ContractRenewalFormState } from '@/ui-kit/components/modals/contract-renewal/models';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contractRenewalButtonVisibility'
})
export class ContractRenewalButtonVisibilityPipe implements PipeTransform {

  transform(formState: ContractRenewalFormState, buttonType: ContractRenewalButtonSettings['type']): boolean {
    if (!formState || !formState.view) {
      return false;
    }
    switch (buttonType) {
      case 'submit':
        return ['paymentSelector'].includes(formState.view) && !formState.nextStep;
      case 'previous':
        return !!formState.previousSteps && formState.previousSteps.length > 0;
      case 'next':
        return !!formState.nextStep;
      case 'recommend':
        return ['success'].includes(formState.view);
      case 'closeWithoutRecommendation':
        return ['success'].includes(formState.view);
      case 'close':
        return ['error'].includes(formState.view);
      case 'upgrade':
        return ['newPricing'].includes(formState.view);
      case 'remindMeLater':
        return ['newPricing'].includes(formState.view);
      case 'sepaSubmit':
        return ['sepa'].includes(formState.view);
    }
    return false;
  }

}
