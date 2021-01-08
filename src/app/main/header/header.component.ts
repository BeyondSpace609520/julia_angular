import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { SplashService } from '@/app/helpers/splash/splash.service';

import { User } from '@/app/auth/models';
import { UserService } from '@/app/auth/user.service';
import { MainService } from '@/app/main/main.service';
import { ViewService } from '@/app/main/view/view.service';
import { EmbedService } from '../embed/embed.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.pug',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User | null = null;
  isMultiUser: boolean;
  isFullServiceCustomer: boolean;
  refreshMenuSizes = new EventEmitter();

  constructor(
    public mainService: MainService,
    private embedService: EmbedService,
    private viewService: ViewService,
    private userService: UserService,
    private splashService: SplashService,
  ) {
    const {c_fullServiceCustomer, au_isAdmin} = this.mainService.getCompanyDetails();
    this.isFullServiceCustomer = c_fullServiceCustomer && au_isAdmin === 'off';
    this.userService.user$.pipe(untilDestroyed(this)).subscribe(user => {
      this.user = user;
      this.isMultiUser = user && user.databases ? user.databases.length > 1 : false;
    });
  }

  public openMessageCenter(): void {
    const embed = {
      moduleId: 'messageCenter',
      selector: 'app-message-center',
    };
    const frame = this.embedService.find(embed.moduleId, embed.selector);

    if (frame && frame.visible) {
      this.embedService.close(embed.moduleId, embed.selector);
    } else {
      this.embedService.open({ embed });
    }
  }

  public openQualityCenter(): void {
    this.embedService.open({
      embed: {
        moduleId: 'qualityCenter',
        selector: 'app-quality-center',
      },
    });
  }

  ngOnInit(): void {
    this.splashService.hide();
  }

  ngOnDestroy(): void {}
}
