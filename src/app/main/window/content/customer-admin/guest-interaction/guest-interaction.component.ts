import { Component } from '@angular/core';

import { InteractionColumn } from '../../../shared/interaction/models';

@Component({
  selector: 'app-guest-interaction',
  templateUrl: './guest-interaction.component.pug',
  styleUrls: ['./guest-interaction.component.sass']
})
export class GuestInteractionComponent {

  columns: InteractionColumn[] = [
    {
      id: 'creationDate',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderDate',
      type: 'date'
    },
    {
      id: 'firstReadDate',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderFirstReadDate',
      type: 'date'
    },
    {
      id: 'lastName',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderCustomer'
    },
    {
      id: 'city',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderCity'
    },
    {
      id: 'emailAddress',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderEMail'
    },
    {
      id: 'name',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderStatus'
    },
    {
      id: 'bookingNo',
      label: 'BackEnd_WikiLanguage.interactionReport_HeaderRefNo'
    },
  ];
}
