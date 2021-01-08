import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LanguageService } from '@/app/i18n/language.service';
import { FormDataService, FormOption } from '@/app/main/shared/form-data.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.pug',
  styleUrls: ['./website.component.sass']
})
export class WebsiteComponent {

  useBuiltInContent = false;

  items = [
    { id: 'pages', label: 'BackEnd_WikiLanguage.CMS_OptionPages' },
    { id: 'images', label: 'BackEnd_WikiLanguage.CMS_OptionImages' },
    { id: 'settings', label: 'BackEnd_WikiLanguage.CMS_OptionSettings' }
  ];
  selectedItemId: string;

  locale = new FormControl();
  locals: FormOption[] = [];

  constructor(
    private formDataService: FormDataService,
    private languageService: LanguageService,
  ) {
    this.locals = this.formDataService.getLocals();
    this.locale.setValue(this.languageService.getLanguageId());
  }
}
