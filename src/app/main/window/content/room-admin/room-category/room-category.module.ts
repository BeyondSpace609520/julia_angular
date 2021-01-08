import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { QuillModule } from 'ngx-quill';

import { LanguageService } from '@/app/i18n/language.service';
import { MainSharedModule } from '@/app/main/main-shared.module';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { CopyToModule } from '../../../shared/copy-to/copy-to.module';
import { ImageSelectorModule } from '../../../shared/image-selector/image-selector.module';
import { InsertModalModule } from '../../../shared/insert-modal/insert-modal.module';
import { LayoutUploaderModule } from '../../../shared/layout-uploader/layout-uploader.module';
import { PeriodConfigModule } from '../../../shared/period-config/period-config.module';
import { PricingSettingsModule } from '../../../shared/pricing-settings/pricing-settings.module';
import { RoomFeaturesModule } from '../../../shared/room-features/room-features.module';
import { PictureService } from './picture.service';
import { RoomCategoryComponent } from './room-category.component';
import { DetailsComponent } from './tabs/details/details.component';
import { LangFormComponent } from './tabs/details/lang-form/lang-form.component';
import { FeaturesComponent } from './tabs/features/features.component';
import { LayoutComponent } from './tabs/layout/layout.component';
import { PicturesComponent } from './tabs/pictures/pictures.component';
import { PricesComponent } from './tabs/prices/prices.component';

@NgModule({
  declarations: [
    RoomCategoryComponent,
    DetailsComponent,
    FeaturesComponent,
    LayoutComponent,
    PicturesComponent,
    LangFormComponent,
    PricesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    InsertModalModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    NgbTooltipModule,
    AutoSizeInputModule,
    PeriodConfigModule,
    CopyToModule,
    RoomFeaturesModule,
    ImageSelectorModule.forRoot(PictureService),
    LayoutUploaderModule,
    PricingSettingsModule
  ],
  providers: [
    PictureService
  ],
  entryComponents: [
    RoomCategoryComponent
  ]
})
export class RoomCategoryModule { }
