import { Injectable, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { environment } from '@/environments/environment';
import { ContractRenewalService } from '@/ui-kit/components/modals/contract-renewal/contract-renewal.service';
import { GDPRAgreementComponent } from '@/ui-kit/components/modals/gdpr-agreement/gdpr-agreement.component';
import { GDPRAgreementModalStatus } from '@/ui-kit/components/modals/gdpr-agreement/gdpr-agreement.model';
import { ModalDirectConnectComponent } from '@/ui-kit/components/modals/modal-direct-connect/modal-direct-connect.component';
import { SaraComponent } from '@/ui-kit/components/modals/sara/sara.component';
import { SugarDataNagscreenComponent } from '@/ui-kit/components/modals/sugar-data-nagscreen/sugar-data-nagscreen.component';
import { FormatService } from '@/ui-kit/services/format.service';
import { ModalOptions, ModalService } from '@/ui-kit/services/modal.service';
import { User } from '../auth/models';
import { reduceRawCustomer } from '../auth/reduce';
import { UserService } from '../auth/user.service';
import { ApiAuthService } from '../helpers/api/api-auth.service';
import { CacheService } from '../helpers/cache.service';
import { LogBackendService } from '../helpers/log-backend.service';
import { AppVersion } from '../helpers/models';
import { PeriodicCheckService } from '../helpers/periodic-check.service';
import { LanguageService } from '../i18n/language.service';
import { ViewService } from '../main/view/view.service';
import { ModalInvoiceNoticeComponent } from './../../ui-kit/components/modal-invoice-notice/modal-invoice-notice.component';
import { CompanyDetails } from './models';

@Injectable({
  providedIn: 'root'
})
export class MainService implements OnDestroy {
  private company: BehaviorSubject<CompanyDetails | null> = new BehaviorSubject(
    null
  );
  public company$: Observable<CompanyDetails | null> = this.company.asObservable();
  public isAdmin$: Observable<boolean> = this.company.asObservable().pipe(
    untilDestroyed(this),
    map((companyDetails) =>
      companyDetails ? companyDetails.au_isAdmin === 'on' : false
    ),
    distinctUntilChanged()
  );

  currentVersion: AppVersion | undefined;
  messageCenterCount: number | undefined;

  constructor(
    private cacheService: CacheService,
    private languageService: LanguageService,
    private logBackendService: LogBackendService,
    private userService: UserService,
    private periodicCheckService: PeriodicCheckService,
    private modalService: ModalService,
    private viewService: ViewService,
    private contractRenewalService: ContractRenewalService,
    private apiAuthService: ApiAuthService,
    private formatService: FormatService,
  ) {
    this.init();
  }

  private async showGDPRAgreementModal(): Promise<void> {
    if (this.company.value && this.company.value.c_gdprAvAccepted === 'off') {
      const letsGo = await this.modalService.openConfirm(
        'modal.gdprAgreementFirstScreenTitle.text',
        'modal.gdprAgreementFirstScreenBody.text',
        {
          primaryButtonLabel: 'BackEnd_WikiLanguage.letsGo',
          textBodyIsHTML: true,
          primaryButtonColor: 'btn-success',
          hideSecondaryButton: true,
          skipJulia: false,
        }
      );
      if (letsGo) {
        const options: ModalOptions = {
          skipJulia: true,
          hideHeader: true,
          textBodyIsHTML: true,
          disableClose: true,
          scrollable: true,
          primaryButtonColor: 'btn-success',
          primaryButtonIcon: 'mdi-chevron-right',
          primaryButtonIconPosition: 'right',
          extraButtonLabel: 'general.back.text',
          extraButtonColor: 'btn-secondary',
          extraButtonIcon: 'mdi-chevron-left',
          extraButtonIconPosition: 'left',
          extraButton: true,
          checkboxForPrimaryButton: true,
          checkboxForPrimaryButtonLabel:
            'modal.gdprAgreementSecondScreenCheckbox.text',
          primaryButtonLabel: 'BackEnd_WikiLanguage.generic_Next',
          savePopOverTitle: 'specialOffer.saveButtonPopOverTitle.text',
          ngbOptions: {
            size: 'xl',
          },
        };
        const modalData = this.modalService.openForms(
          '',
          GDPRAgreementComponent,
          options
        );
        modalData.modalBody.init(this.company.getValue());
        // modal events
        modalData.modal.save.subscribe((isBackButtonClicked) => {
          let newModalStatus: GDPRAgreementModalStatus | undefined;
          if (isBackButtonClicked) {
            if (
              modalData.modalBody.modalStatus ===
              GDPRAgreementModalStatus.Contract
            ) {
              modalData.modal.close(false);
              this.showGDPRAgreementModal();
            }
            if (
              modalData.modalBody.modalStatus ===
              GDPRAgreementModalStatus.FinalStep
            ) {
              newModalStatus = GDPRAgreementModalStatus.Contract;
              modalData.modal.buttonSaveLabel =
                'BackEnd_WikiLanguage.generic_Next';
              modalData.modal.hideCheckboxForPrimaryButton = false;
              modalData.modal.formStatus = true;
            }
          } else {
            //////////////////////////////
            // Show 3rd screen
            if (
              modalData.modalBody.modalStatus ===
              GDPRAgreementModalStatus.Contract
            ) {
              newModalStatus = GDPRAgreementModalStatus.FinalStep;
              modalData.modal.buttonSaveLabel =
                'BackEnd_WikiLanguage.agreeAndContinue';
              modalData.modal.hideCheckboxForPrimaryButton = true;
              modalData.modal.formStatus =
                modalData.modalBody.newsletter === true;
            }
            if (
              modalData.modalBody.modalStatus ===
              GDPRAgreementModalStatus.FinalStep
            ) {
              // primary button is clicked
              modalData.modal.isSaveProcessing = true;
              modalData.modalBody.saveContract().then(() => {
                modalData.modal.close(true);
              });
            }
          }
          if (
            Object.values(GDPRAgreementModalStatus).includes(newModalStatus) &&
            newModalStatus !== undefined
          ) {
            modalData.modalBody.modalStatus = newModalStatus;
          }
        });
        modalData.result.catch();
      }
    }
  }

  public async updateCompanyDetails(skipUserUpdate?: boolean): Promise<void> {
    const data = await this.cacheService.getCompanyDetails(true);
    this.company.next(data);
    if (!skipUserUpdate) {
      await this.setUser();
      await this.languageService.setLanguage(+data.c_beLocale_id);
    }
  }

  /**
   * @deprecated Use {@link CacheService.getCompanyDetails}
   */
  public getCompanyDetails(): CompanyDetails {
    return this.cacheService.getCompanyDetailsSnapshot(); // TODO
  }

  /**
   * if activated shows the formatted loginMessage
   * in the backend after login is completed,
   */
  public showLoginMessageDialog(): void {
    if (
      this.company.value &&
      this.company.value.c_loginMessageActive === 'on'
    ) {
      this.modalService.openSimpleText(
        this.company.value.c_loginMessageTitle,
        this.company.value.c_loginMessage,
        {
          closeLabel: 'BackEnd_WikiLanguage.generic_Ok',
          textBodyIsHTML: true,
        }
      );
    }
  }

  /**
   * if activated shows the contract renewal dialog
   * in the backend after login is completed
   */
  public showContractRenewalDialog(): void {
    if (
      this.company.value &&
      (this.company.value.showSugarContractRenewalDialog === 'on' ||
        window.location.hash.match(/^#test-modal/))
    ) {
      this.contractRenewalService.openContactRenewal();
    }
  }

  public showInvoiceNoticeDialog(): void {
    const data = this.getCompanyDetails();
    if (data.showInvoiceDialog === 'on') {
      const modal = this.modalService.openBorderless(
        ModalInvoiceNoticeComponent, {disableClose: true}
      );
      modal.modalBody.cancel.subscribe(() => {
        modal.modal.close(true);
        if (data.showAgainAfterXSeconds > 0) {
          window.setTimeout(() => {
            this.showInvoiceNoticeDialog();
          }, data.showAgainAfterXSeconds * 1000);
        }
      });
    }
  }

  public showSugarDataNagscreen(): void {
    if (
      this.company.value
      && (this.company.value.showSugarDataNagScreen === 'on')
    ) {
      const modal = this.modalService.openBorderless(
        SugarDataNagscreenComponent, {disableClose: true, ngbOptions: { size: 'lg' }}
      );
      }
  }

  public showSaraCallToAction(): void {
    if (
      this.company.value
      && (this.company.value.ss_newDesignReservation === '0' && this.company.value.ss_hideCalltoActionModal === '0')
    ) {
      window.setTimeout(() => {
        const modal = this.modalService.openBorderless(
          SaraComponent, {
            disableClose: true,
          });
      }, 180000);
    }
  }

  private showDirectConnectModal(): void {
    const company: CompanyDetails | null = this.company.getValue();
    if (company && company.isHybridCustomer === 'off' && company.showCMDirectConnectSellingModal === 'on') {
        this.modalService.openBorderless(ModalDirectConnectComponent, { disableClose: true, ngbOptions: { size: 'lg' } });
      }
    }

  private async init(): Promise<void> {
    this.currentVersion = await this.periodicCheckService.init();
    this.listenToCompanyChanges();
    this.listenToLogin();
    this.listenToNewMessages();
  }

  private listenToNewMessages(): void {
    this.periodicCheckService.messageCenterCount$
      .pipe(untilDestroyed(this))
      .subscribe(async (messageCount) => {
        this.messageCenterCount = messageCount;
      });
  }

  private listenToLogin(): void {
    this.userService.loggedIn$.pipe(
      untilDestroyed(this)
    ).subscribe(async loggedIn => {
      if (loggedIn) {
        await this.updateCompanyDetails();
        await this.logBackendService.init();
        this.showLoginMessageDialog();
        this.showContractRenewalDialog();
        this.showGDPRAgreementModal();
        if (this.company.value && this.company.value.au_isAdmin === 'off') {
          this.showInvoiceNoticeDialog();
          this.showSaraCallToAction();
          this.showDirectConnectModal();
          this.showSugarDataNagscreen();
        }
        if (environment.startupWindow) {
          this.viewService.openViewById(environment.startupWindow);
        }
      }
    });
  }

  private listenToCompanyChanges(): void {
    this.company$.pipe(untilDestroyed(this)).subscribe(companySettings => {
      if (companySettings) {
        this.formatService.setCurrency(+companySettings.c_currency_id, '', companySettings.currencySymbol);
      }
    });
  }

  private async setUser(): Promise<void> {
    const companyDetails = this.company.getValue();
    if (!companyDetails) {
      return;
    }
    const user: User = {
      username: companyDetails.username,
      database: companyDetails.dbName,
      hotelName: companyDetails.c_name
    };
    const userData = await this.apiAuthService.checkAuth('info').toPromise();
    if (userData && userData.databases) {
      user.databases = userData.databases.map(customer => reduceRawCustomer(customer));
    }
    this.userService.setUser(user);
  }

  ngOnDestroy(): void {}
}
