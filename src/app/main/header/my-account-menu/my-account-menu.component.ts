import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

import { AppVersion } from '@/app/helpers/models';

import { AuthService } from '@/app/auth/auth.service';
import { CacheService } from '@/app/helpers/cache.service';
import { ViewService } from '@/app/main/view/view.service';
import { ChangePasswordService } from '@/ui-kit/components/modals/change-password/change-password.service';

@Component({
  selector: 'app-my-account-menu',
  templateUrl: './my-account-menu.component.pug',
  styleUrls: ['./my-account-menu.component.sass']
})
export class MyAccountMenuComponent {

  customerName: string;

  @Input() currentVersion?: AppVersion;
  @Output() myAccountMenuReady = new EventEmitter();
  @HostBinding('class.header-dropdown') readonly dropdownClass = true;
  @HostBinding('class.toggled') opened = false;
  @HostListener('mouseleave') onMouseLeave() {
    this.opened = false;
  }

  constructor(
    private authService: AuthService,
    private cacheService: CacheService,
    private viewService: ViewService,
    private changePasswordService: ChangePasswordService,
  ) {
    this.init().then(() => this.myAccountMenuReady.emit() );
  }

  logout(): void {
    this.authService.logout();
  }

  openCompanySettings(): void {
    this.viewService.focusViewById('hotelManagement');
  }

  openChangePasswordModal(): void {
    this.changePasswordService.openModal();
  }

  toggle(): void {
    this.opened = !this.opened;
  }

  private async init(): Promise<void> {
    const { c_name } = await this.cacheService.getCompanyDetails();
    this.customerName = c_name;
  }
}
