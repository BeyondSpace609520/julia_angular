import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

import { LanguageService } from '@/app/i18n/language.service';
import { EbDatePipe } from '@/app/main/shared/eb-date.pipe';
import { SharedModule } from '@/app/shared/module';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { PICTURE_PROVIDER, PictureService } from './injection';
import { PicturesComponent } from './pictures.component';

@NgModule({
  declarations: [PicturesComponent, ImageCarouselComponent],
  imports: [
    CommonModule,
    SharedModule,
    EasybookingUISharedModule.forRoot(LanguageService, EbDatePipe),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [PicturesComponent]
})
export class ImageSelectorModule {
  static forRoot(pictureService: Type<PictureService<unknown>>): ModuleWithProviders {
    return {
      ngModule: ImageSelectorModule,
      providers: [
        {
          provide: PICTURE_PROVIDER,
          useExisting: pictureService
        }
      ]
    };
  }
}
