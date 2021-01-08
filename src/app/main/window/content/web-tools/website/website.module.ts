import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { QuillModule } from 'ngx-quill';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { ImageSelectorModule } from '../../../shared/image-selector/image-selector.module';
import { WebsiteIframeComponent } from './iframe/website-iframe.component';
import { ImagesComponent } from './images/images.component';
import { PagesComponent } from './pages/pages.component';
import { PictureService } from './picture.service';
import { SettingsComponent } from './settings/settings.component';
import { WebsiteComponent } from './website.component';

@NgModule({
  declarations: [WebsiteComponent, WebsiteIframeComponent, PagesComponent, ImagesComponent, SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    QuillModule.forRoot(),
    ImageSelectorModule.forRoot(PictureService)
  ],
  providers: [
    PictureService
  ],
  entryComponents: [WebsiteComponent],
})
export class WebsiteModule { }
