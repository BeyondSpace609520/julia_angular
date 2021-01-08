import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { sumBy } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { MainService } from '@/app/main/main.service';
import { PermissionService } from '@/app/main/permission/permission.service';
import { FormOption } from '@/app/main/shared/form-data.service';
import { ViewService } from '@/app/main/view/view.service';
import { MoveToRoomplanEvent } from '@/app/main/window/content/calendar/calendar-html/events';
import { focusRoomplan } from '@/app/main/window/content/calendar/calendar-html/focusRoomplan';
import { ExportTable } from '@/app/main/window/content/customer-admin/guest-registration/exporters/models';
import { exportTablesAsPdf } from '@/app/main/window/content/customer-admin/guest-registration/exporters/pdf';
import { formatExportTable } from '@/app/main/window/content/customer-admin/guest-registration/exporters/reduce';
import { EventBusService } from '@/app/main/window/shared/event-bus';
import { normalizeDateRange } from '@/app/main/window/shared/forms/utils';
import { sort } from '@/app/main/window/shared/table/sort';
import { SortEvent } from '@/app/main/window/shared/table/sortable.directive';
import { getUrlFromPath } from '@/app/main/window/utils';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { DATE_FORMAT_PROVIDER, PipeDate } from '@/ui-kit/injection';
import { DateRange } from '@/ui-kit/models';
import { FormatService } from '@/ui-kit/services/format.service';
import { BillingOverviewService } from '../../billing-overview.service';
import { LoaderType } from '../../loader-types';
import { ExportInvoiceComponent } from '../../modal/export-invoice/export-invoice.component';
import { ShowBillSplitIconComponent } from '../../modal/show-bill-split-icon/show-bill-split-icon.component';
import { ManageInvoiceComponent } from './manage-invoice/manage-invoice.component';
import { InvoiceIdentifier } from './manage-invoice/models';
import {
  BillingInvoice,
  BillingInvoiceTax,
  BillingInvoiceTotals,
  InvoiceDateType,
  InvoiceOutstanding,
  InvoicesRequestParams,
  InvoiceType,
} from './models';

import { downloadAsExcel } from '../../../../customer-admin/guest-registration/exporters/xls';
import { prepareExportFields } from './reduce';

@Component({
  selector: 'app-billing-invoices-tab',
  templateUrl: './billing-invoices-tab.component.pug',
  styleUrls: ['./billing-invoices-tab.component.sass'],
})
export class BillingInvoicesTabComponent implements OnInit, OnDestroy {
  @Input() range?: DateRange;
  @Input() bookingNumber?: string;
  @Input() openManageInvoiceModal?: boolean;
  @Input() type?: InvoiceType;

  public types: (FormOption & { value: InvoiceType })[] = [
    { name: 'BackEnd_WikiLanguage.InvShowAll', value: 'all' },
    { name: 'BackEnd_WikiLanguage.InvJustShowBills', value: 'bills' },
    { name: 'BackEnd_WikiLanguage.InvJustShowPreviewbills', value: 'preview' },
  ];
  public dateTypes: (FormOption & { value: InvoiceDateType })[] = [
    { name: 'BackEnd_WikiLanguage.EBP_ArrivalDate', value: 'arrivalDate' },
    { name: 'BackEnd_WikiLanguage.EBP_DepartureDate', value: 'departureDate' },
    { name: 'BackEnd_WikiLanguage.IE_InvoiceDate', value: 'invoiceDate' },
  ];
  public outstandings: (FormOption & { value: InvoiceOutstanding })[] = [
    { name: 'BackEnd_WikiLanguage.InvShowAll', value: 'all' },
    { name: 'BackEnd_WikiLanguage.BW_OutstandingWith', value: 'with' },
    { name: 'BackEnd_WikiLanguage.BW_OutstandingWithout', value: 'without' },
  ];

  public form: FormGroup;
  public billingInvoices: BillingInvoice[];
  public sortedBillingInvoices: BillingInvoice[];
  public total: BillingInvoiceTotals = {};

  public isLoading: Observable<boolean>;

  constructor(
    public mainService: MainService,
    private modalService: ModalService,
    private apiClient: ApiClient,
    private viewService: ViewService,
    private eventBus: EventBusService,
    private updateList: BillingOverviewService,
    private loaderService: LoaderService,
    private permission: PermissionService,
    private translate: TranslateService,
    private formatService: FormatService,
    @Inject(DATE_FORMAT_PROVIDER) private dateFormatter: PipeDate,
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.BILLING);
  }

  @Loading(LoaderType.BILLING)
  public async getBillingTableData(init?: boolean): Promise<void> {
    this.billingInvoices = await this.queryBillingTableData();
    this.sort(null);
    this.total = calculateTotal(this.billingInvoices);

    // shortcut from infobox or offerwizard. It should open the ManageInvoiceComponent.
    if (init && this.openManageInvoiceModal && this.bookingNumber) {
      this.openManageInvoiceModal = false;
      const manageThisInvoice = this.billingInvoices.find(
        (i) => i.b_bookingNo === this.bookingNumber
      );
      if (manageThisInvoice) {
        this.openInvoiceModal(manageThisInvoice);
      }
    }
  }

  public async queryBillingTableData(
    performanceDetails: boolean = false
  ): Promise<BillingInvoice[]> {
    const params: InvoicesRequestParams = {
      fromDate: (this.form.get('fromDate') as FormControl).value as Date,
      untilDate: (this.form.get('untilDate') as FormControl).value as Date,
      searchString: (this.form.get('searchString') as FormControl)
        .value as string,
      filterOption: (this.form.get('type') as FormControl).value as InvoiceType,
      dateFilterOption: (this.form.get('dateType') as FormControl)
        .value as InvoiceDateType,
      outstandingOption: (this.form.get('outstanding') as FormControl)
        .value as InvoiceOutstanding,
      showSplitBills: (this.form.get('splitInvoices') as FormControl)
        .value as boolean,
      showDeleted: (this.form.get('deleteInvoices') as FormControl)
        .value as boolean,
      performanceDetails,
    };
    return await this.apiClient.billingOverviewGetList(params).toPromise();
  }

  private calculateTaxTable(billingInvoices: BillingInvoice[]): BillingInvoiceTax[] {
    const invoices = billingInvoices.filter(
      (invoice) =>
        invoice.masterBill !== 1 &&
        (invoice.b_bookingNo ||
          invoice.bv_creationDate ||
          invoice.billNo ||
          invoice.accountNo ||
          invoice.totalPrepaidAmount)
    );

    // DONE - iterate over all invoices and their taxLists
    //  find all taxname
    //  sumup per taxname - instead of all together

    // DONE - per taxName
    const taxList: {
      [index: string]: BillingInvoiceTax;
    } = {};

    invoices.forEach((invoice) => {
      invoice.taxesList.forEach((tax) => {
        if (tax.taxName in taxList) {
          taxList[tax.taxName].net += tax.net;
          taxList[tax.taxName].tax += tax.tax;
          taxList[tax.taxName].gross += tax.gross;
        } else {
          taxList[tax.taxName] = {
            taxName: tax.taxName,
            sortOrder: tax.sortOrder,
            net: tax.net,
            tax: tax.tax,
            gross: tax.gross,
          };
        }
      });
    });

    // DONE - order by sortOrder
    const taxListSorted = Object.values(taxList).sort((a, b) =>
      a.sortOrder < b.sortOrder ? -1 : a.sortOrder > b.sortOrder ? 1 : 0
    );

    // DONE - add sums for taxtable
    taxListSorted.push({
      taxName: '',
      sortOrder: 0,
      net: sumBy(taxListSorted, (t) => t.net),
      tax: sumBy(taxListSorted, (t) => t.tax),
      gross: sumBy(taxListSorted, (t) => t.gross),
    });

    return Object.values(taxListSorted);
  }

  public async openRoomplan(item: BillingInvoice): Promise<void> {
    const [arrivalDate, id, type] = [
      item.minArrivalDateUK,
      item.id,
      item.bs_name,
    ];

    await focusRoomplan(this.viewService);

    if (arrivalDate === null || type === null) {
      throw new Error('Cannot open roomplan. The params contain null');
    }

    this.eventBus.emit<MoveToRoomplanEvent>('moveToRoomplan', {
      arrivalDate,
      id,
      type,
    });
  }

  public async openRestoreInvoiceModal(item: BillingInvoice): Promise<void> {
    const result = await this.modalService.openConfirm(
      'BackEnd_WikiLanguage.restoreButton',
      'BackEnd_WikiLanguage.restoreInvoiceAreYouSure',
      {
        primaryButtonLabel: 'BackEnd_WikiLanguage.restoreButton',
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
        fullWidthModalBody: true,
        ngbOptions: {
          size: 'sm',
        },
      }
    );

    if (result && item.id) {
      await this.apiClient
        .restoreInvoiceForPermanentlyDeletedBooking(item.id)
        .toPromise();
    } else if (result) {
      await this.apiClient
        .restoreInvoiceForDeletedStandaloneInvoiceComments(item.billId)
        .toPromise();
    }
    this.getBillingTableData();
  }

  @Loading(LoaderType.BILLING)
  public async generatePDF(item: BillingInvoice): Promise<void> {
    const url = await this.apiClient
      .generateBillPDF(item.billId, item.b_id)
      .toPromise();

    window.open(getUrlFromPath(url), '_blank');
  }

  public async deleteInvoicesBill(item: BillingInvoice): Promise<void> {
    const result = await this.modalService.openConfirm(
      'BackEnd_WikiLanguage.BW_DeleteBillConfirmationHeader',
      'BackEnd_WikiLanguage.BW_DeleteBillConfirmationText',
      {
        ngbOptions: {
          size: 'sm',
        },
      }
    );

    if (result) {
      await this.apiClient.deleteBill(item.billId).toPromise();
      this.getBillingTableData();
    }
  }

  public async correctInvoice(item: BillingInvoice): Promise<void> {
    const result = await this.modalService.openConfirm(
      '',
      'BackEnd_WikiLanguage.cancellationInvoiceConfirmMessage',
      {
        primaryButtonLabel:
          'BackEnd_WikiLanguage.cancellationInvoiceConfirmButton',
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Cancel',
        ngbOptions: {
          size: 'sm',
        },
      }
    );

    if (result) {
      await this.confirmCorrectinvoice(item);
      this.getBillingTableData();
    }
  }

  @Loading(LoaderType.BILLING)
  public async confirmCorrectinvoice(item: BillingInvoice): Promise<void> {
    await this.apiClient.cancelInvoice(item.billId).toPromise();
  }

  public async showBillSplitIcon(item: BillingInvoice) {
    const modal = await this.modalService.openForms(
      'BackEnd_WikiLanguage.billSplitTitle',
      ShowBillSplitIconComponent,
      {
        ngbOptions: { size: 'xl' },
        disableClose: true,
        hidePrimaryButton: true,
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Close',
        academyScreenId: 'billSplit',
      }
    );

    modal.modalBody.init(item.billId);
  }

  public async newBill() {
    const companyDetails = this.mainService.getCompanyDetails();
    const dbName = companyDetails.dbName;
    const response = await this.apiClient
      .createNewBill(new Date(), new Date(), dbName)
      .toPromise();
    return response.billId;
  }

  public async openInvoiceModal(item?: BillingInvoice) {
    const saved = item !== undefined;

    const identifier: InvoiceIdentifier = {
      billId: item === undefined ? await this.newBill() : item.billId,
      bookingId: item === undefined ? 0 : item.id,
    };

    const modalData = this.modalService.openForms(
      'BackEnd_WikiLanguage.BW_InvoiceItems',
      ManageInvoiceComponent,
      {
        primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Save',
        disableClose: false,
        cancelWithoutClosing: true,
        cancelIconWithoutClosing: true,
        ngbOptions: {
          size: 'lg',
        },
      }
    );

    modalData.modalBody.init(
      identifier,
      item === undefined ? null : item,
      this.permission.can.forceEdit,
      modalData.modal,
      saved
    );
    modalData.modalBody.hidePrimaryButton.subscribe((value) => {
      modalData.modal.hidePrimaryButton = value;
    });
    modalData.modal.cancel.subscribe(() => {
      modalData.modal.close(true);
      if (modalData.modalBody.saved === false) {
        this.apiClient.cleanupStandaloneBill(identifier.billId).toPromise();
      }
      this.getBillingTableData();
    });
  }

  public async openExportModal() {
    const modalData = await this.modalService.openForms(
      'BackEnd_WikiLanguage.BW_exportButton',
      ExportInvoiceComponent,
      {
        disableClose: true,
        primaryButtonLabel: 'BackEnd_WikiLanguage.BW_exportButton',
        secondaryButtonLabel: 'BackEnd_WikiLanguage.generic_Close',
      }
    );

    modalData.modalBody.init(modalData.modal);

    modalData.modal.save.subscribe(async () => {
      await this.loadExport(
        modalData.modalBody.exportType,
        modalData.modalBody.exportFormat
      );
      // start loading screen
      modalData.modal.close(true);
    });
  }

  public openView(moduleId: string): void {
    this.viewService.openViewById(moduleId);
  }

  private initForm(): void {
    const defaultFromDate = dayjs().subtract(28, 'day').toDate();
    const defaultUntilDate = dayjs().add(2, 'day').toDate();
    this.form = new FormGroup({
      searchString: new FormControl(this.bookingNumber || ''),
      type: new FormControl(this.type ? this.type : 'all'),
      dateType: new FormControl('departureDate'),
      outstanding: new FormControl('all'),
      fromDate: new FormControl(
        this.range ? this.range.start : defaultFromDate
      ),
      untilDate: new FormControl(
        this.range ? this.range.end : defaultUntilDate
      ),
      splitInvoices: new FormControl(false),
      deleteInvoices: new FormControl(false),
    });
    normalizeDateRange(
      this.form.get('fromDate') as FormControl,
      this.form.get('untilDate') as FormControl,
      untilDestroyed(this)
    );
  }

  private async prepareExportTables(invoices: BillingInvoice[]): Promise<{invoicesTable: ExportTable, taxesTable: ExportTable} | null> {
    const invoicesTable = await this.prepareInvoicesExportTable(invoices);
    if (!invoicesTable) {
      return null;
    }
    return {
      invoicesTable,
      taxesTable: await this.prepareTaxesExportTable(invoices)
    };
  }

  private async prepareInvoicesExportTable(invoices: BillingInvoice[]): Promise<ExportTable | null> {
    const invoiceData = invoices.map((row: BillingInvoice) => prepareExportFields(row));
    if (invoiceData.length === 0) {
      return null;
    }
    const invoiceHeaders = await this.prepareExportTableHeaders(Object.keys(invoiceData[0]));
    const totals = calculateTotal(invoices);
    const invoiceFooters: ExportTable['footers'] = [{
      export_net: totals.net ? +totals.net.toFixed(2) : 0,
      export_localTax: totals.VT ? +totals.VT.toFixed(2) : 0,
      export_tax: totals.tax ? +totals.tax.toFixed(2) : 0,
      export_gross: totals.gross ? +totals.gross.toFixed(2) : 0,
      export_depositAmount: totals.prepaidAmount
        ? +totals.prepaidAmount.toFixed(2)
        : 0,
      export_outstanding: totals.outstanding
        ? +totals.outstanding.toFixed(2)
        : 0,
    }];
    return {
      headers: invoiceHeaders,
      data: invoiceData,
      footers: invoiceFooters
    };
  }

  private async prepareTaxesExportTable(invoices: BillingInvoice[]): Promise<ExportTable> {
    const taxHeaders = await this.prepareExportTableHeaders(['export_taxrate', 'export_net', 'export_tax', 'export_gross']);
    const taxTable = this.calculateTaxTable(invoices);
    const taxData = taxTable.map((taxRow) => ({
      export_taxrate: taxRow.taxName,
      export_net: taxRow.net ? +taxRow.net.toFixed(2) : 0,
      export_tax: taxRow.tax ? +taxRow.tax.toFixed(2) : 0,
      export_gross: taxRow.gross ? +taxRow.gross.toFixed(2) : 0,
    }));
    return {
      headers: taxHeaders,
      data: taxData
    };
  }

  private async prepareExportTableHeaders(keys: string[]): Promise<{[key: string]: string}> {
    const headers: {[key: string]: string} = {};
    const translations = await this.translate.get(keys.map(key => 'BackEnd_WikiLanguage.' + key)).toPromise();
    keys.forEach(key => {
      headers[key] = translations['BackEnd_WikiLanguage.' + key];
    });
    return headers;
  }

  @Loading(LoaderType.EXPORT)
  private async loadExport(type: string, format: string): Promise<void> {
    // query invoices again - optionally with performance details
    const invoices = await this.queryBillingTableData(
      type === 'withPerformanceDetails'
    );
    const exportTables = await this.prepareExportTables(invoices);

    if (exportTables) {
      const {invoicesTable, taxesTable} = exportTables;

      const filename = await this.translate.get('BackEnd_WikiLanguage.BW_invoicesTAB').toPromise();

      switch (format) {
        case 'excel':
          this.exportAsExcel(invoicesTable, taxesTable, filename);
          break;
        case 'pdf':
          this.exportAsPdf(invoicesTable, taxesTable, filename);
          break;
      }
    } else {
      // message : empty export
    }
  }

  private exportAsExcel(invoicesTable: ExportTable, taxesTable: ExportTable, filename: string): void {
    if (invoicesTable.footers) {
      invoicesTable.footers.forEach(footerRow => {
        invoicesTable.data.push(footerRow);
      });
    }
    invoicesTable.data.push({});
    invoicesTable.data.push({});
    invoicesTable.data.push({});
    invoicesTable.data.push(prepareTaxTableRowForExcelExport(taxesTable.headers));
    taxesTable.data.forEach(dataRow => {
      invoicesTable.data.push(prepareTaxTableRowForExcelExport(dataRow));
    });
    downloadAsExcel(
      invoicesTable.headers,
      invoicesTable.data,
      filename
    );
  }

  private exportAsPdf(invoicesTable: ExportTable, taxesTable: ExportTable, filename: string): void {
    const dateFormat = this.dateFormatter.getFormat();
    delete invoicesTable.headers.export_invoiceText;
    exportTablesAsPdf(
      [
        formatExportTable(invoicesTable, this.formatService, dateFormat),
        formatExportTable(taxesTable, this.formatService, dateFormat)
      ],
      {
        filename,
        landscape: true,
        fontSize: 6
      }
    );
  }

  private sort(rule: SortEvent | null): void {
    this.sortedBillingInvoices = sort(this.billingInvoices, rule);
    groupSorted(this.sortedBillingInvoices);
  }

  @Loading(LoaderType.BILLING)
  async ngOnInit() {
    this.initForm();

    await this.getBillingTableData(true);

    this.updateList.updateList$.subscribe(() => this.getBillingTableData());
  }

  ngOnDestroy() {}
}

function groupSorted(arr: BillingInvoice[]) {
  for (let i = 0; i < arr.length - 2; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const a = arr[i];
      const b = arr[j];
      const isNeighbors = i + 1 === j;

      if (isNeighbors && a.b_billSplit_id === b.b_billSplit_id) {
        i++; continue;
      }

      if (a.b_billSplit_id === b.b_billSplit_id) {
        arr.splice(j, 1);
        arr.splice(i + 1, 0, b);
      }
    }
  }
}

function calculateTotal(
  billingInvoices: BillingInvoice[]
): BillingInvoiceTotals {
  const invoices = billingInvoices.filter(
    (invoice) =>
      invoice.masterBill !== 1 &&
      (invoice.b_bookingNo ||
        invoice.bv_creationDate ||
        invoice.billNo ||
        invoice.accountNo ||
        invoice.totalPrepaidAmount)
  );

  return {
    insuranceProductsAmount: sumBy(
      invoices,
      (v) => v.totalInsuranceProductsAmount
    ),
    net: sumBy(invoices, (v) => v.totalGross - v.totalTax),
    VT: sumBy(invoices, (v) => v.totalVT),
    tax: sumBy(invoices, (v) => v.totalTax),
    gross: sumBy(invoices, (v) => v.totalGross),
    prepaidAmount: sumBy(invoices, (v) => v.totalPrepaidAmount || 0),
    outstanding: sumBy(invoices, (v) => v.totalOutstanding || 0),
  };
}

function prepareTaxTableRowForExcelExport(row: {[key: string]: string | number | Date}): {[key: string]: string | number | Date} {
  return {
    export_firstName: row.export_taxrate,
    export_lastName: row.export_net,
    export_arrival: row.export_tax,
    export_departure: row.export_gross,
  };
}
