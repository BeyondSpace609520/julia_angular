import { CacheService } from '@/app/helpers/cache.service';
import { CompanyDetails } from '@/app/main/models';
import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-invoice-notice',
  templateUrl: './modal-invoice-notice.component.html',
  styleUrls: ['./modal-invoice-notice.component.scss'],
})
export class ModalInvoiceNoticeComponent implements OnInit, AfterViewInit {
  public companyDetails: CompanyDetails;
  public closeAfterXSeconds: number;
  public timer: number;
  public disableClose: boolean = true;
  @Output() cancel = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private cacheService: CacheService,
  ) { }

  ngOnInit() {
    this.companyDetails = this.cacheService.getCompanyDetailsSnapshot();
    this.closeAfterXSeconds = this.companyDetails.closeAfterXSeconds;
  }

  ngAfterViewInit() {
    this.StartTimer();
  }

  StartTimer(){
    this.timer = window.setTimeout(() => 
      {
        if(this.closeAfterXSeconds <= 0) { }
        this.closeAfterXSeconds -= 1;

        if(this.closeAfterXSeconds>0){
          this.StartTimer();
        } else{
          this.disableClose = false;
        }
      }, 1000);
  }

  close() {
    this.cancel.emit();
  }
}
