import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { QuillModule } from 'ngx-quill';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';

import { CopyToModule } from '../../../shared/copy-to/copy-to.module';
import { TableModule } from '../../../shared/table/table.module';
import { SeasonSelectComponent } from './season-select/season-select.component';
import { AttachmentsComponent } from './tabs/attachments/attachments.component';
import { EmailComponent } from './tabs/email/email.component';
import { ImageComponent } from './tabs/images/image/image.component';
import { ImagesComponent } from './tabs/images/images.component';
import { PdfComponent } from './tabs/pdf/pdf.component';
import { TemplateAdminComponent } from './template-admin.component';

@NgModule({
  declarations: [
    TemplateAdminComponent,
    SeasonSelectComponent,
    EmailComponent,
    PdfComponent,
    ImagesComponent,
    ImageComponent,
    AttachmentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    QuillModule.forRoot(),
    NgbTooltipModule,
    CopyToModule,
    TableModule,
  ],
  entryComponents: [TemplateAdminComponent],
})
export class TemplateAdminModule {}
