import { Component, Input, OnInit } from '@angular/core';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../../loader-types';
import { CustomerBooking } from '../../../models';
import { BookingRoom } from '../models';
import getFields from './fields';

@Component({
  selector: 'app-booking-rooms',
  templateUrl: './rooms.component.pug',
  styleUrls: ['./rooms.component.sass']
})
export class RoomsComponent implements OnInit {

  @Input() item: CustomerBooking;

  fields: ReturnType<typeof getFields>;

  rooms: BookingRoom[] = [];
  selectedRoom: BookingRoom | null = null;

  constructor(
    private apiClient: ApiClient,
    public loaderService: LoaderService
  ) { }

  @Loading(LoaderType.CUSTOMER_BOOKING)
  async ngOnInit() {
    const cleanUpLabel = await this.apiClient.getBookingChargeTranslation().toPromise();

    this.fields = getFields(cleanUpLabel || 'BackEnd_WikiLanguage.EPP_PriceCleanUp');
    this.rooms = await this.apiClient.getBookingRooms(this.item.id).toPromise();
  }

  selectRoom(room: BookingRoom) {
    this.selectedRoom = room;
  }
}
