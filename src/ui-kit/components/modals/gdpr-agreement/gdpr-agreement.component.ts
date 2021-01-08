import { ApiGeneralService } from '@/app/helpers/api/api-general.service';
import { ApiSupportFormService } from '@/app/helpers/api/api-support-form.service';
import { CompanyDetails } from '@/app/main/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import {
  GDPRAgreementContract,
  GDPRAgreementModalStatus,
  SugarAccountData
} from '@/ui-kit/components/modals/gdpr-agreement/gdpr-agreement.model';
import { Component, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gdpr-agreement',
  templateUrl: './gdpr-agreement.component.html',
  styleUrls: ['./gdpr-agreement.component.scss']
})
export class GDPRAgreementComponent {
  @ViewChild('contractArea', { static: false }) contractArea: ElementRef;

  public modalStatus: GDPRAgreementModalStatus;
  public contract: GDPRAgreementContract;
  public isLoading: Observable<boolean>;
  public formStatus = new EventEmitter<boolean>();
  public newsletter: boolean;

  private companyDetails: CompanyDetails | null;
  private contractHTML: string;

  GDPRAgreementModalStatus = GDPRAgreementModalStatus;

  constructor(
    public loaderService: LoaderService,
    private apiGeneralService: ApiGeneralService,
    private apiSupportFormService: ApiSupportFormService,
  ) {
    this.isLoading = this.loaderService.isLoading('GDPRContract');
  }

  @Loading('GDPRContract')
  public async init(companyDetails: CompanyDetails | null) {
    this.formStatus.emit(false);
    this.companyDetails = companyDetails as CompanyDetails;
    this.modalStatus = GDPRAgreementModalStatus.Contract;
    const parameters = {
      legalDocName: 'avContractNotSigned',
      legalDocType: 'backEnd',
      legalDocCategory: 'guest'
    };
    this.contract = await this.apiGeneralService.getGDPRAgreementContract(parameters).toPromise();
    const sugarAccountData: SugarAccountData = await this.apiSupportFormService.getSugarAccountData(this.companyDetails.dbName).toPromise();
    const dateSplit = sugarAccountData.orderdate_c.split('-');
    if (this.contract && this.contract.textHTML) {
      this.contractHTML = this.contract.textHTML.replace('{{companyName}}', '<b>' + sugarAccountData.company_name_c + '</b>')
        .replace('{{accountName}}', '<b>' + sugarAccountData.name  + '</b>')
        .replace('{{shipping_address_street}}', '<b>' + sugarAccountData.shipping_address_street + '</b>')
        .replace('{{shipping_address_postalcode}}', '<b>' + sugarAccountData.shipping_address_postalcode + '</b>')
        .replace('{{shipping_address_city}}', '<b>' + sugarAccountData.shipping_address_city + '</b>')
        .replace('{{shipping_address_country}}', '<b>' + this.companyDetails.c_country + '</b>') // shipping_address_country
        .replace('[Datum]', dateSplit[2]+'.'+dateSplit[1]+'.'+dateSplit[0]);
      this.contractArea.nativeElement.innerHTML = this.contractHTML;
    }
  }

  public async saveContract() {
    const PostData = {
      documentID: this.contract.id,
      eb_username: this.companyDetails ? this.companyDetails.username : ''
    };
    return await this.apiSupportFormService.sendGDPRAgreementContract(PostData).toPromise();
  }

  public onNewsletterChange(value: boolean) {
    this.newsletter = value;
    this.formStatus.emit(value);
  }
}
