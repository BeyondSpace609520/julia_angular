import { AuthService } from '@/app/auth/auth.service';
import { ApiHotelService } from '@/app/helpers/api/api-hotel.service';
import {Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-sara',
  templateUrl: './sara.component.html',
  styleUrls: ['./sara.component.scss'],
})
export class SaraComponent implements OnInit {
  public page: number = 1;

  constructor(
    public activeModal: NgbActiveModal,
    private auth: AuthService,
    private apiHotel: ApiHotelService
  ) { }

  ngOnInit() {
    
  }

  public async useSaraNow(): Promise<void> {
    const { customerId } = this.auth.getQueryParams();
    await this.apiHotel.activateSara(+customerId).toPromise();
    this.page = 3;
  }

  public async hideSara(): Promise<void> {
    const { customerId } = this.auth.getQueryParams();
    await this.apiHotel.hideSaraModal(+customerId).toPromise();
    this.activeModal.close();
  }

  public openSaraBlog() {
    window.open("https://blog.easybooking.eu/kommunikation-mit-app-sara/", "_blank");
  }

  public openAcademy() {
    window.open("https://www.easybooking.academy/anleitungen/buchungstools-sara-app", "_blank");
  }
}
