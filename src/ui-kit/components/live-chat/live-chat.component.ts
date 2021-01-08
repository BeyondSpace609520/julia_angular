import { LanguageService } from '@/app/i18n/language.service';
import { MainService } from '@/app/main/main.service';
import { CompanyDetails } from '@/app/main/models';
import { ScriptService } from '@/ui-kit/services/script.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.sass']
})
export class LiveChatComponent implements OnInit, OnDestroy {

  private company: CompanyDetails;

  @Input() enabled = false;

  constructor(
    private scriptService: ScriptService,
    private mainService: MainService,
    private languageService: LanguageService
  ) { }

  private async loadScript(): Promise<void> {
    const status = await this.scriptService.load('livezilla');
    window.dispatchEvent(new Event('load'));
    this.updateLiveZillaData();
  }

  private updateLiveZillaData(): void {
    (window as any).lz_data = {
      overwrite: false,
      0: this.company.dbName,
      1: '<!--replace_me_with_CustomField3-->',
      2: '<!--replace_me_with_CustomField3-->',
      3: '<!--replace_me_with_CustomField4-->',
      4: '<!--replace_me_with_CustomField5-->',
      5: '<!--replace_me_with_CustomField6-->',
      6: '<!--replace_me_with_CustomField7-->',
      7: '<!--replace_me_with_CustomField8-->',
      8: '<!--replace_me_with_CustomField9-->',
      9: '<!--replace_me_with_CustomField10-->',
      111: this.company.c_name,
      112: this.company.c_eMail,
      113: '', // Company
      114: '', // Question
      116: '<!--replace_me_with_Phone-->',
      language: this.getLanguageCode(),
      header: '<!--replace_me_with_Logo-->',
      website: '<!--replace_me_with_Area-->'
    };
    // (window as any).LiveZillaData.Groups.Language = 'en';
    // this.updateLzDataValue('email', this.user.email);
    // this.updateLzDataValue('name', (this.user.firstName || '') + ' ' + (this.user.lastName || ''));
  }

  private getLanguageCode(): string {
    return this.languageService.getLanguageCode().substr(0, 2).toUpperCase();
  }


  ngOnInit() {
    this.mainService.company$.pipe(untilDestroyed(this)).subscribe(company => {
      if (company) {
        this.company = company;
        if (company.sugarChatEnabled === 'on') {
          this.loadScript();
        }
      }
    })
  }

  ngOnDestroy(): void {}

}
