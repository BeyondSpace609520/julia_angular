import { ApiClient } from '@/app/helpers/api-client';
import { ViewService } from '@/app/main/view/view.service';
import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-direct-connect-confirm',
  templateUrl: './modal-direct-connect.component.html',
  styleUrls: ['./modal-direct-connect.component.scss'],
})
export class ModalDirectConnectComponent implements OnInit {

  constructor(
    private apiClient: ApiClient,
    private viewService: ViewService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  public openCM() {
    this.activeModal.close(true);
    const directConnect = true;
    this.viewService.focusViewWithProperties(
      'channelAvailabilityAdmin',
      {
        directConnect
      }
    );
  }

  public async notInterested(): Promise<void> {
    await this.apiClient.cmDirectConnectNotInterested().toPromise();
    this.activeModal.close(true);
  }

}
