import { Pipe, PipeTransform } from '@angular/core';

import { ResendEmailData } from '@/app/main/window/shared/customer/resend-email/resend-email.directive';

@Pipe({
  name: 'resendEmailData'
})
export class ResendEmailDataPipe implements PipeTransform {

  transform(billingId: number, customerId: number, email: string): ResendEmailData {
    return {
      billingId,
      targetId: customerId,
      email
    };
  }

}
