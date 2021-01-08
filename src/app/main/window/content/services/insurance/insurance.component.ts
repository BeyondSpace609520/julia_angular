import { Component, OnInit } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { PermissionService } from '@/app/main/permission/permission.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.pug',
  styleUrls: ['./insurance.component.sass']
})
export class InsuranceComponent implements OnInit {

  tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'summary',
        label: 'BackEnd_WikiLanguage.ER_ContractSummaryLabel'
      },
      {
        id: 'overview',
        label: 'BackEnd_WikiLanguage.ER_offerSummary'
      }
    ],
    buttonClasses: ['nav-link']
  };
  activeTabId = 'summary';

  constructor(private permission: PermissionService) { }

  get showAd() {
    return !this.permission.can.seeInsurance;
  }

  ngOnInit() {
  }

}
