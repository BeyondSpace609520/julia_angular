import { Component, Input, OnInit } from '@angular/core';

import { TabsSettings } from 'easybooking-ui-kit/components/tabs/tabs.models';

import { MainService } from '@/app/main/main.service';
import { DateRange } from '@/ui-kit/models';
import { InvoiceType } from './tabs/billing-invoices-tab/models';

@Component({
  selector: 'app-billing-overview',
  templateUrl: './billing-overview.component.pug',
  styleUrls: ['./billing-overview.component.sass']
})
export class BillingOverviewComponent implements OnInit {

  @Input() range?: DateRange;
  @Input() bookingNumber?: string;
  @Input() openManageInvoiceModal?: boolean;
  @Input() type?: InvoiceType;

  public showReceipts: boolean;

  tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'invoice',
        label: 'BackEnd_WikiLanguage.BW_invoicesTAB'
      },
      {
        id: 'receipts',
        label: 'BackEnd_WikiLanguage.BW_cashReceiptsTAB'
      }
    ],
    buttonClasses: ['nav-link']
  };

  activeTabId: string;

  constructor(private mainService: MainService) {
  }

  ngOnInit() {
    this.activeTabId = this.tabSettings.buttons[0].id;
    const {c_hasCashRegisterModule} = this.mainService.getCompanyDetails();
    this.showReceipts = (c_hasCashRegisterModule === 'on');

    if (!this.showReceipts) {
      this.tabSettings.buttons.splice(1, 1);
    }
  }

}
