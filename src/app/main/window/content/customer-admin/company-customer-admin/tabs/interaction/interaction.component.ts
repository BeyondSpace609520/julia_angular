import { Component, Input } from '@angular/core';

import { Customer } from '@/app/main/window/shared/customer/models';
import { InteractionColumn, InteractionFilter } from '@/app/main/window/shared/interaction/models';


@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.pug',
  styleUrls: ['./interaction.component.sass']
})
export class InteractionComponent {

  @Input() item: Customer;

  public columns: InteractionColumn[] = [
    {
      id: 'bookingNo',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderRefNo'
    },
    {
      id: 'bsName',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderStatus'
    },
    {
      id: 'creationDate',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderDate',
      type: 'date'
    },
    {
      id: 'name',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderStatus'
    },
    {
      id: 'firstReadDate',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderFirstReadDate',
      type: 'date'
    },
    {
      id: 'emailAddress',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderEMail'
    },
    {
      id: 'totalNet',
      label: 'BackEnd_WikiLanguage.CCAB_BookingDetailEntityTotalNet',
      type: 'number'
    }
  ];

  get filterInteractions(): InteractionFilter {
    return { customerId: this.item.id };
  }
}
