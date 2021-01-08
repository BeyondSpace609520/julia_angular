import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contractRenewalHello'
})
export class ContractRenewalHelloPipe implements PipeTransform {

  transform(salutation?: string): string {
    const suffix = salutationSuffixes[salutation || ''];
    return 'BackEnd_WikiLanguage.CRF_Hello' + (suffix || '');
  }

}

const salutationSuffixes: {[key: string]: string} = {
  'Mrs.': 'Missis',
  'Ms.': 'Miss',
  'Mr.': 'Mister',
  'family': 'Family',
};
