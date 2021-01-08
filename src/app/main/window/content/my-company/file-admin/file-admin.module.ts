import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { CopyToModule } from '../../../shared/copy-to/copy-to.module';
import { InsertModalModule } from '../../../shared/insert-modal/insert-modal.module';
import { TableModule } from '../../../shared/table/table.module';
import { FileAdminComponent } from './file-admin.component';
import { FilesComponent } from './files/files.component';

@NgModule({
  declarations: [FileAdminComponent, FilesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    NgbTooltipModule,
    TableModule,
    VirtualScrollerModule,
    InsertModalModule,
    CopyToModule
  ],
  entryComponents: [FileAdminComponent]
})
export class FileAdminModule { }
