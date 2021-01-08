import { Component, Input, OnInit } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.pug',
  styleUrls: ['./general-settings.component.sass']
})
export class GeneralSettingsComponent implements OnInit {

  @Input() preselectTabId?: string;

  tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'interests',
        label: 'BackEnd_WikiLanguage.MW_SettingCharacteristics'
      },
      {
        id: 'travel',
        label: 'BackEnd_WikiLanguage.MW_Reason'
      },
      {
        id: 'arrival',
        label: 'BackEnd_WikiLanguage.MW_SettingVisitReason'
      },
      {
        id: 'identification',
        label: 'BackEnd_WikiLanguage.MW_DocumentType'
      },
      {
        id: 'guest-rating',
        label: 'BackEnd_WikiLanguage.guestReviewTabLBL'
      },
      {
        id: 'sources',
        label: 'BackEnd_WikiLanguage.customSourcesTabLabel'
      },
      {
        id: 'gdpr',
        label: 'BackEnd_WikiLanguage.genericGDPR'
      }
    ],
    buttonClasses: ['nav-link']
  };

  activeTabId: string;

  constructor() { }

  ngOnInit() {
    this.activeTabId = this.preselectTabId || this.tabSettings.buttons[0].id;
    this.preselectTabId = undefined;
  }

}
