import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import version from '@/version.json';
import { LanguageService } from './language.service';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?v=' + version.version);
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    LanguageService
  ]
})
export class I18nModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: I18nModule,
      providers: [LanguageService],
    };
  }

}

