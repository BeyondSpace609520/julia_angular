import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { PortalComponent } from './portal.component';
import { TextareaComponent } from './textarea/textarea.component';
import { ClassSelectorComponent } from './class-selector/class-selector.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';


@NgModule({
  declarations: [PortalComponent, TextareaComponent, ClassSelectorComponent, ImageUploaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    NgbTooltipModule,
  ],
  entryComponents: [PortalComponent]
})
export class PortalModule { }
