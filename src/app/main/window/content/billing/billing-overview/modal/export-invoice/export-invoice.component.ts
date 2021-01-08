import { Component, EventEmitter, OnDestroy, ViewChild } from '@angular/core';

import { ModalFormsComponent } from 'easybooking-ui-kit/components/modal-forms/modal-forms.component';
// import { ModalService } from 'easybooking-ui-kit/services/modal.service';
import { Observable } from 'rxjs';

import { FormControl, FormGroup } from '@angular/forms';

// import { TranslateService } from '@ngx-translate/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

// import { ApiClient } from '@/app/helpers/api-client';
// import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';


@Component({
  selector: 'app-export-invoice',
  templateUrl: './export-invoice.component.pug',
  styleUrls: ['./export-invoice.component.sass'],
})
export class ExportInvoiceComponent implements OnDestroy {
  export = new EventEmitter<void>();

  public exportType = '';
  public exportFormat = '';
  public modal: ModalFormsComponent;

  public isLoading: Observable<boolean>;
  public exportWaiting: Observable<boolean>;

  form: FormGroup;

  constructor(
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.EXPORT);
  }

  async init(modal: ModalFormsComponent) {
    this.modal = modal;
    this.form = this.createForm();

    const typeControl = this.form.get('type') as FormControl;
    typeControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((newValue) => {
        this.exportType = newValue;
      });
    this.exportType = typeControl.value;

    const formatControl = this.form.get('format') as FormControl;
    formatControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((newValue) => {
        this.exportFormat = newValue;
      });
    this.exportFormat = formatControl.value;
  }

  public createForm() {
    return new FormGroup({
      type: new FormControl('onlyInvoice'),
      format: new FormControl('excel'),
    });
  }

  ngOnDestroy(): void  {}
}
