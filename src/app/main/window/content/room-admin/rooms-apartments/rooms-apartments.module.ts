import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { CopyToModule } from '../../../shared/copy-to/copy-to.module';
import { ImageSelectorModule } from '../../../shared/image-selector/image-selector.module';
import { LayoutUploaderModule } from '../../../shared/layout-uploader/layout-uploader.module';
import { PricingSettingsModule } from '../../../shared/pricing-settings/pricing-settings.module';
import { RoomFeaturesModule } from '../../../shared/room-features/room-features.module';
import { TableModule } from '../../../shared/table/table.module';
import { LicenseUpsellingModule } from '../license-upselling/license-upselling.module';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { CalendarComponent } from './edit-room/tabs/calendar/calendar.component';
import { DescriptionComponent } from './edit-room/tabs/description/description.component';
import { DetailComponent } from './edit-room/tabs/detail/detail.component';
import { ImagesComponent } from './edit-room/tabs/images/images.component';
import { LayoutComponent } from './edit-room/tabs/layout/layout.component';
import { PricingComponent } from './edit-room/tabs/pricing/pricing.component';
import { EditSeparatorComponent } from './edit-separator/edit-separator.component';
import { LicenseComponent } from './new-modal/license/license.component';
import { NewModalComponent } from './new-modal/new-modal.component';
import { PictureService } from './picture.service';
import { RoomsApartmentsComponent } from './rooms-apartments.component';

@NgModule({
  declarations: [
    RoomsApartmentsComponent,
    NewModalComponent,
    EditSeparatorComponent,
    EditRoomComponent,
    DetailComponent,
    DescriptionComponent,
    CalendarComponent,
    ImagesComponent,
    LayoutComponent,
    PricingComponent,
    LicenseComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
    RoomFeaturesModule,
    NgbTooltipModule,
    ImageSelectorModule.forRoot(PictureService),
    LayoutUploaderModule,
    LicenseUpsellingModule,
    PricingSettingsModule,
    CopyToModule,
    TableModule,
  ],
  providers: [PictureService],
  entryComponents: [
    RoomsApartmentsComponent,
    NewModalComponent,
    LicenseComponent,
  ],
})
export class RoomsApartmentsModule {}
