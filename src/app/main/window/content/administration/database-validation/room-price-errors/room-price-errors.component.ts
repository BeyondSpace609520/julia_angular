import { Component, OnInit } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { RoomPriceError } from '../models';

@Component({
  selector: 'app-room-price-errors',
  templateUrl: './room-price-errors.component.pug',
  styleUrls: ['./room-price-errors.component.sass']
})
export class RoomPriceErrorsComponent implements OnInit {

  roomErrors: RoomPriceError[] = [];

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  @Loading(LoaderType.LOAD)
  async ngOnInit() {
    this.roomErrors = await this.apiClient.getRoomPriceErrors().toPromise();
  }
}
